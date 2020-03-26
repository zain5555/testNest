import { ConflictException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './types/dto/auth.dto';
import { MeInterface } from '../user/types/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { RegisterInterface } from './types/interfaces/auth.interface';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { CompanyService } from '../company/company.service';
import { startCase } from 'lodash';
import { UserInterface } from '../schema/user.schema';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { RolesEnum } from '../common/constants';
import { CompanyInterface } from '../schema/company.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly companyService: CompanyService,
  ) {
  }
  
  async validateUser(credentials: LoginDto): Promise<MeInterface | undefined> {
    const user: MeInterface = await this.userService.findOneWherePopulated({ email: credentials.email });
    if (user && user.password && user.isActive && bcrypt.compareSync(credentials.password, user.password)) {
      delete user.password;
      return user;
    }
    return undefined;
  }
  
  async getUser(userId: string): Promise<MeInterface> {
    return await this.userService.findOneByIdPopulated(userId);
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
      firstName: startCase(registerInfo.firstName.trim()),
      lastName: startCase(registerInfo.lastName.trim()),
    };
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
      await session.commitTransaction();
      // send email for activation here
      return insertedUser;
    } catch (e) {
      console.warn(e);
      session.abortTransaction();
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
}
