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

  // async invited(companyId: string, emails: string, user: UserInterface): Promise<AddInvitationResponseInterface[]> {
  //   const company: CompanyInterface = await this.companyService.getIfCompanyExistsAndIAmAdmin(companyId, user._id);
  //   const existingUsers: UserInterface[] = await this.userService.findAllWhere({
  //     email: {
  //       $in: emails,
  //     },
  //     isActive: true,
  //     companies: {
  //       $elemMatch: {
  //         company: companyId,
  //         isActive: true,
  //       },
  //     },
  //   });
  //   const existingInvitationsOfCompany: InvitationInterface[] = await this.findAllWhere({
  //     company: companyId,
  //     isActive: true,
  //     isAccepted: false,
  //   });
  //   const newInvitations: InvitationInterface[] = [];
  //   const response: AddInvitationResponseInterface[] = [];
  //   for (const email of emails) {
  //     const userExisted = existingUsers.find(user => user.email === email);
  //     if (userExisted) {
  //       response.push({
  //         invitationId: null,
  //         message: ErrorMessages.ALREADY_MEMBER.replace('?', email),
  //         email,
  //       });
  //       continue;
  //     }
  //     const existingInvitation: InvitationInterface = existingInvitationsOfCompany?.find(invite => invite.email === email);
  //     if (existingInvitation) {
  //       response.push({
  //         invitationId: null,
  //         message: ErrorMessages.ALREADY_INVITED.replace('?', email),
  //         email,
  //       });
  //       continue;
  //     }
  //     if (company.subscription.maxUsers && company?.users?.length + existingInvitationsOfCompany?.length + newInvitations.length >= company.subscription.maxUsers) {
  //       response.push({
  //         invitationId: null,
  //         message: ErrorMessages.MAX_USER_LIMIT_REACHED,
  //         email,
  //       });
  //       continue;
  //     }
  //     newInvitations.push({
  //       email,
  //       invitedBy: user._id,
  //       company: companyId,
  //     });
  //   }
  //   if (newInvitations.length) {
  //     const insertedInvitations: InsertedInvitationsInterface[] = await this.insertMany(newInvitations);
  //     for (const invitation of insertedInvitations) {
  //       response.push({
  //         invitationId: invitation._doc._id,
  //         email: invitation._doc.email,
  //         message: ResponseMessages.INVITED_SUCCESSFULLY.replace('?', invitation._doc.email),
  //       });
  //       this.sendInvitationLink(invitation._doc._id, user, invitation._doc, company);
  //     }
  //   }
  //   return response;
  // }


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

    const user = await this.userService.findOneWhere({ email })
    if (!user) {
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

    else {
      const checkIfUserAlreadyInvited = await this.userService.findAllWhere({
        _id: {
          $ne: user._id,
        },
        isActive: true,
        companies: {
          $elemMatch: {
            company: companyId,
            isActive: true,
          },
        },
      });

      if (checkIfUserAlreadyInvited) {
        response = {
          message: ErrorMessages.ALREADY_INVITED.replace('?', email),
          email,
        };
        return response
      }


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
          _id: user._id,
        }, { session, lean: true });
        await this.companyService.findOneAndUpdateWhere({
          $push: {
            users: {
              user: user._id,
            },
          },
        }, {
          _id: companyId,
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
}
