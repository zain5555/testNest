import {
  // ConflictException,
  forwardRef,
  // HttpException,
  // HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  // UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultInternalServerErrorResponse } from '../common/responses';
// import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { StringHelper } from '../helper/string.helper';
import { CompanyService } from '../company/company.service';
import { CompanyInterface } from '../schema/company.schema';
// import { MeInterface } from '../user/types/interfaces/user.interface';
import { ErrorMessages, ResponseMessages } from '../common/errors';
import { UserService } from '../user/user.service';
import { UserInterface } from '../schema/user.schema';
import { MailGunHelper } from '../helper/mailgun.helper';
import { AuthService } from '../auth/auth.service';
import { AddInvitationResponseInterface } from './types/interfaces/invitation.interface';




@Injectable()
export class InvitationService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
    private readonly stringHelper: StringHelper,
    private readonly mailGunHelper: MailGunHelper,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {
  }


  async invite(companyId: string, email: string, owner: UserInterface): Promise<AddInvitationResponseInterface> {

    let session;
    let response: AddInvitationResponseInterface;

    const company: CompanyInterface = await this.companyService.getIfCompanyExistsAndIAmAdmin(companyId, owner._id);

    if (company) {
      response = {
        message: ErrorMessages.GENERIC_FORBIDDEN,
        email,
      }
    }
    const checkIfUserAlreadyInvited = await this.userService.findOneWhere({ email })


    if (checkIfUserAlreadyInvited) {
      response = {
        message: ErrorMessages.GENERIC_CONFLICT,
        email,
      };
      return response
    }

      const newUser = await this.authService.registerBroker({ email, password: (await this.stringHelper.generateRandomString(8)).toString() }, companyId)

      try {
        session = await this.userModel.db.startSession();
        await session.startTransaction();
        await this.userService.findOneAndUpdateWhere({
          isActive: true,
          isEmailVerified: true,
          $push: {
            companies: {
              company: companyId,
            },
          },
        }, {
          _id: newUser._id,
        }, { session, lean: true });
        await session.commitTransaction();

        response = {
          email: email,
          message: ResponseMessages.INVITED_SUCCESSFULLY.replace('?', email),
        };
        return response;


      } catch (e) {
        console.warn(e);
        session.abortTransaction();
        throw new InternalServerErrorException(defaultInternalServerErrorResponse);
      }
    }


  
}
