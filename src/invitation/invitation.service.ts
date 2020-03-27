import {
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException, NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvitationInterface } from '../schema/invitation.schema';
import { Conflict, defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { StringHelper } from '../helper/string.helper';
import { CompanyService } from '../company/company.service';
import { CompanyInterface } from '../schema/company.schema';
import { MeInterface } from '../user/types/interfaces/user.interface';
import { ErrorMessages, HttpErrors, ResponseMessages } from '../common/errors';
import { UserService } from '../user/user.service';
import { UserInterface } from '../schema/user.schema';
import { AddInvitationResponseInterface, InvitationJwtInterface } from './types/interfaces/invitation.interface';

@Injectable()
export class InvitationService {
  constructor(
    @InjectModel('Invitation') private readonly invitationModel: Model<InvitationInterface>,
    private readonly stringHelper: StringHelper,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
  }
  
  async findOneById(id: string, projection?: unknown): Promise<InvitationInterface> {
    try {
      return await this.invitationModel.findById(id).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneWhere(where: unknown, projection?: unknown): Promise<InvitationInterface> {
    try {
      return await this.invitationModel.findOne(where).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findAllWhere(where): Promise<InvitationInterface[]> {
    try {
      return await this.invitationModel.find(where).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async insertOne(invitation: InvitationInterface, options?: QueryGenericOptionsInterface): Promise<InvitationInterface> {
    try {
      const docs = await this.invitationModel(invitation).save(options);
      return docs.toObject();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneAndUpdateWhere(newValuesOfUser: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<InvitationInterface | QueryUpdateInterface> {
    try {
      return await this.invitationModel.findOneAndUpdate(where, newValuesOfUser, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async invite(companyId: string, email: string, user: MeInterface): Promise<AddInvitationResponseInterface> {
    const company: CompanyInterface = await this.companyService.getIfCompanyExistsAndIAmManager(companyId, user._id);
    const existingUser: UserInterface = await this.userService.findOneWhere({
      email,
      isActive: true,
      companies: {
        $elemMatch: {
          company: companyId,
          isActive: true,
        },
      },
    });
    if (existingUser) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.ALREADY_MEMBER.replace('?', email),
      });
    }
    const existingInvitationsOfCompany: InvitationInterface[] = await this.findAllWhere({
      company: companyId,
      isActive: true,
      isAccepted: false,
    });
    const existingInvitation: InvitationInterface = existingInvitationsOfCompany?.find(invite => invite.email === email);
    if (existingInvitation) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.ALREADY_INVITED.replace('?', email),
      });
    }
    if (company?.users?.length + existingInvitationsOfCompany?.length >= company.subscription.maxUsers) {
      throw new HttpException({
        statusCode: HttpStatus.PAYMENT_REQUIRED,
        error: HttpErrors.PAYMENT_REQUIRED,
        message: ErrorMessages.MAX_USER_LIMIT_REACHED,
      }, HttpStatus.PAYMENT_REQUIRED);
    }
    const invitation: InvitationInterface = await this.insertOne({
      company: companyId,
      email,
      invitedBy: user._id,
    });
    await this.sendInvitationLink(invitation._id, undefined, invitation, company);
    return {
      email,
      message: ResponseMessages.INVITED_SUCCESSFULLY,
      invitationId: invitation._id,
    };
  }
  
  async fetchInvitationDetails(invitationId: string, email?: string): Promise<InvitationInterface> {
    const where: any = {
      _id: invitationId,
    };
    if (email) {
      where.email = email;
    }
    const invitation: InvitationInterface = await this.findOneWhere(where);
    if (!invitation) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.INVITATION_NOT_FOUND,
      });
    }
    if (invitation.isAccepted) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.ALREADY_ACCEPTED,
      });
    }
    if (!invitation.isActive && !invitation.isAccepted) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessages.INVITATION_REVOKED,
      });
    }
    return invitation;
  }
  
  async acceptInvitation(invitationId: string, user: MeInterface): Promise<boolean> {
    const invitation: InvitationInterface = await this.fetchInvitationDetails(invitationId, user.email);
    return this.acceptMyInvite(invitation, user._id);
  }
  
  async acceptMyInvite(invitation: InvitationInterface, userId: string): Promise<boolean> {
    let session;
    try {
      session = await this.invitationModel.db.startSession();
      await session.startTransaction();
      await this.userService.findOneAndUpdateWhere({
        isActive: true,
        isEmailVerified: true,
        $push: {
          companies: {
            company: invitation.company,
          },
        },
      }, {
        _id: userId,
      }, { session, lean: true });
      await this.companyService.findOneAndUpdateWhere({
        $push: {
          users: {
            user: userId,
          },
        },
      }, {
        _id: invitation.company,
      }, { session, lean: true });
      await this.findOneAndUpdateWhere({
        isActive: false,
        isAccepted: true,
      }, {
        _id: invitation._id,
      }, { session, lean: true });
      await session.commitTransaction();
      return true;
    } catch (e) {
      console.warn(e);
      session.abortTransaction();
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async checkInvitationValidity(jwt: string): Promise<InvitationInterface> {
    let invitation: InvitationJwtInterface;
    try {
      invitation = await this.stringHelper.verifyPayload(jwt) as unknown as InvitationJwtInterface;
    } catch (e) {
      console.warn(e);
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: e?.message || ErrorMessages.INVALID_JWT,
      });
    }
    return this.fetchInvitationDetails(invitation.invitationId, invitation.email);
  }
  
  async sendInvitationLink(invitationId: string, user?: MeInterface, invitation?: InvitationInterface, company?: CompanyInterface): Promise<boolean> {
    if (!invitation && !company && user) {
      invitation = await this.fetchInvitationDetails(invitationId);
      company = await this.companyService.getIfCompanyExistsAndIAmManager(invitation.company, user._id);
    }
    const jwt = await this.stringHelper.signPayload({
      email: invitation.email,
      invitationId: invitation._id,
      company: {
        _id: company._id,
        name: company.name,
      },
    }, invitation.email);
    console.log(jwt);
    // ToDo: send email here
    return true;
  }
}
