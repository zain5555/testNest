import { ConflictException, HttpStatus, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './types/dto/auth.dto';
import { MeInterface } from '../user/types/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { ActivationJwtInterface, RegisterInterface, RegisterUserInterface } from './types/interfaces/auth.interface';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { CompanyService } from '../company/company.service';
import { startCase } from 'lodash';
import { UserInterface } from '../schema/user.schema';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { RolesEnum } from '../common/constants';
import { CompanyInterface } from '../schema/company.schema';
import { StringHelper } from '../helper/string.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly stringHelper: StringHelper,
  ) {
  }
  
  async validateUser(credentials: LoginDto): Promise<MeInterface | undefined> {
    const user: MeInterface = await this.userService.findOneWherePopulated({ email: credentials.email });
    if (user && user.password && user.isActive && bcrypt.compareSync(credentials.password, user.password)) {
      return user;
    }
    return undefined;
  }
  
  async getUser(userId: string): Promise<MeInterface> {
    return await this.userService.findOneByIdPopulated(userId);
  }
  
  async register(registerInfo: RegisterInterface, registerByInvitation: boolean): Promise<UserInterface> {
    const email: string = registerInfo.email.trim().toLowerCase();
    const existingUser: UserInterface = await this.userService.findOneWhere({ email });
    if (existingUser && existingUser.isActive) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: registerByInvitation ? ErrorMessages.LOGIN_TO_ACCEPT_INVITE : ErrorMessages.EMAIL_ALREADY_EXISTS,
      });
    }
    const newUser: UserInterface = {
      email: registerInfo.email.trim().toLowerCase(),
      password: bcrypt.hashSync(registerInfo.password, 10),
      fullName: startCase(registerInfo.firstName.trim()) + ' ' + startCase(registerInfo.lastName.trim()),
    };
    if (!registerByInvitation) {
      let session;
      try {
        session = await this.companyService.getSession();
        await session.startTransaction();
        const newCompany: CompanyInterface = await this.companyService.insertOne({ name: registerInfo.companyName.trim() }, { session });
        newUser.companies = [{
          company: newCompany._id,
          role: RolesEnum.MANAGER,
          creator: true,
          isActive: true,
        }];
        const insertedUser: UserInterface = await this.userService.insertOne(newUser, { session });
        await this.companyService.findOneAndUpdateWhere({
          creator: insertedUser._id,
          users: [{
            user: insertedUser._id,
            role: RolesEnum.MANAGER,
          }],
        }, { _id: newCompany._id }, { session });
        await session.commitTransaction();
        return insertedUser;
      } catch (e) {
        console.warn(e);
        session.abortTransaction();
        throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    } else {
      newUser.isEmailVerified = true;
      return this.userService.insertOne(newUser);
    }
  }
  
  async sendActivationLink(email: string, user?: UserInterface): Promise<boolean> {
    if (!user) {
      user = await this.userService.findOneWhere({ email });
    }
    await this.checkUserActivationStatus(user);
    const activationObject: ActivationJwtInterface = {
      email,
    };
    const jwt = await this.stringHelper.signPayload(activationObject, email);
    console.log(jwt);
    // ToDo: send activation link to email
    return true;
  }
  
  async registerByActivationLink(jwt: string): Promise<UserInterface> {
    let userToBeActivate: ActivationJwtInterface;
    try {
      userToBeActivate = await this.stringHelper.verifyPayload(jwt) as unknown as ActivationJwtInterface;
    } catch (e) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: e?.message || ErrorMessages.INVALID_JWT,
      });
    }
    const existingUser: UserInterface = await this.userService.findOneWhere({
      email: userToBeActivate.email,
    });
    if (existingUser && existingUser.isEmailVerified) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.ALREADY_VERIFIED,
      });
    }
    return await this.userService.findOneAndUpdateWhere({
      isEmailVerified: true,
    }, {
      email: userToBeActivate.email,
    }, {
      lean: true,
      new: true,
    }) as unknown as UserInterface;
  }
  
  async checkUserActivationStatus(user: UserInterface): Promise<boolean> {
    if (!user || !user.isActive) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessages.REGISTER_FIRST,
      });
    }
    if (user.isEmailVerified) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.ALREADY_VERIFIED,
      });
    }
    return true;
  }
  
}
