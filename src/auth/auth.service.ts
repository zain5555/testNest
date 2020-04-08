import {
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './types/dto/auth.dto';
import { MeInterface } from '../user/types/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import {  RegisterInterface, ResetPasswordPayload } from './types/interfaces/auth.interface';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { CompanyService } from '../company/company.service';
import { startCase } from 'lodash';
import { UserInterface } from '../schema/user.schema';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { RolesEnum } from '../common/constants';
import { CompanyInterface } from '../schema/company.schema';
import { StringHelper } from '../helper/string.helper';
import { MailGunHelper } from '../helper/mailgun.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
    private readonly stringHelper: StringHelper,
    private readonly mailGunHelper: MailGunHelper,
  ) {
  }

  async validateUser(credentials: LoginDto): Promise<UserInterface | undefined> {
    const user: UserInterface = await this.userService.findOneWhere({ email: credentials.email });
    if (user && user.password && user.isActive && bcrypt.compareSync(credentials.password, user.password)) {
      return user;
    }
    return undefined;
  }

  async getUser(userId: string): Promise<MeInterface> {
    return await this.userService.findOneByIdPopulated(userId);
  }

  async getUnpopulatedUser(userId: string): Promise<UserInterface> {
    return await this.userService.findOneById(userId);
  }

  async register(registerInfo: RegisterInterface): Promise<UserInterface> {
    const email: string = registerInfo.email.trim().toLowerCase();
    const existingUser: UserInterface = await this.userService.findOneWhere({ email });
    if (existingUser && existingUser.isActive) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.EMAIL_ALREADY_EXISTS,
      });
    }
    const newUser: UserInterface = {
      email: registerInfo.email.trim().toLowerCase(),
      password: bcrypt.hashSync(registerInfo.password, 10),
      fullName: startCase(registerInfo.firstName.trim()) + ' ' + startCase(registerInfo.lastName.trim()),
    };
    let session;
    try {
      session = await this.companyService.getSession();
      await session.startTransaction();
      const newCompany: CompanyInterface = await this.companyService.insertOne({ name: registerInfo.companyName.trim() }, { session });
      newUser.companies = [{
        company: newCompany._id,
        role: RolesEnum.ADMIN,
        creator: true,
        isActive: true,
      }];
      const insertedUser: UserInterface = await this.userService.insertOne(newUser, { session });
      await this.companyService.findOneAndUpdateWhere({
        creator: insertedUser._id,
        users: [{
          user: insertedUser._id,
          role: RolesEnum.ADMIN,
        }],
      }, { _id: newCompany._id }, { session });
      await session.commitTransaction();
      this.mailGunHelper.signUpEmail(insertedUser.email, insertedUser.fullName, newCompany.name);
      return insertedUser;
    } catch (e) {
      console.warn(e);
      session.abortTransaction();
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }

  }

  async registerBroker(registerInfo: RegisterInterface, companyId: string): Promise<UserInterface> {
    // console.log(registerInfo)
    const email: string = registerInfo.email.trim().toLowerCase();
    const existingUser: UserInterface = await this.userService.findOneWhere({ email });
    if (existingUser && existingUser.isActive) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.EMAIL_ALREADY_EXISTS,
      });
    }
    const newUser: UserInterface = {
      email: registerInfo.email.trim().toLowerCase(),
      password: bcrypt.hashSync(registerInfo.password, 10),
      fullName: registerInfo.firstName? startCase(registerInfo.firstName.trim()) + ' ' + startCase(registerInfo.lastName.trim()) : " ",
    };
    let session;
    try {
      session = await this.companyService.getSession();
      await session.startTransaction();
      const newCompany: CompanyInterface = await this.companyService.findOneWhere({
        _id: companyId,
        isActive: true,
      });

      // newUser.companies = [{
      //   company: companyId,
      //   role: RolesEnum.BROKER,
      //   creator: true,
      //   isActive: true,
      // }];
      const insertedUser: UserInterface = await this.userService.insertOne(newUser, { session });
      await this.companyService.findOneAndUpdateWhere({
        creator: insertedUser._id,
        $push: {
          users: {
            user: insertedUser._id,
            role: RolesEnum.BROKER,          },
        },

      }, { _id: companyId }, { session });
      await session.commitTransaction();
      this.mailGunHelper.signUpEmailForBroker(insertedUser.email, insertedUser.fullName, insertedUser.password, newCompany.name);
      return insertedUser;
    } catch (e) {
      console.warn(e);
      session.abortTransaction();
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }

  }

  async forgotPassword(email: string): Promise<boolean> {
    const user = await this.userService.findOneWhere({ email, isActive: true });
    if (!user) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.USER_NOT_FOUND,
      });
    }
    const jwt: string = await this.stringHelper.signPayload({
      email: user.email,
    }, user._id.toString());
    this.mailGunHelper.forgotPasswordEmail(jwt, user.email, user.fullName);
    return true;
  }

  async resetPassword(data: ResetPasswordPayload): Promise<any> {
    let jwtData: { email: string };
    try {
      jwtData = await this.stringHelper.verifyPayload(data.jwt) as unknown as { email: string };
      if (!jwtData || !jwtData.email) {
        throw new Error('Invalid Token!');
      }
    } catch (e) {
      console.warn(e);
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: e?.message || ErrorMessages.INVALID_JWT,
      });
    }
    const password = bcrypt.hashSync(data.password, 10);
    return await this.userService.findOneAndUpdateWhere({
      password,
      isEmailVerified: true,
    }, {
      email: jwtData.email,
    }, {
      lean: true,
      new: true
    });
  }

}
