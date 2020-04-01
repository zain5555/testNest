import { ForbiddenException, forwardRef, HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../schema/user.schema';
import { defaultForbiddenResponse, defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { GetAllCompanyUsersInterface, MeInterface } from './types/interfaces/user.interface';
import { CompanyService } from '../company/company.service';
import { InvitationService } from '../invitation/invitation.service';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { RolesEnum } from '../common/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserInterface>,
    @Inject(forwardRef(() => CompanyService))
    private readonly companyService: CompanyService,
    @Inject(forwardRef(() => InvitationService))
    private readonly invitationService: InvitationService,
  ) {
  }
  
  async findOneByIdPopulated(id: string, projection?: unknown): Promise<MeInterface> {
    try {
      return await this.userModel.findById(id)
        .select(projection)
        .populate('companies.company', '_id name')
        .lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneById(id: string, projection?: unknown): Promise<UserInterface> {
    try {
      return await this.userModel.findById(id).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneWhere(where: unknown, projection?: unknown): Promise<UserInterface> {
    try {
      return await this.userModel.findOne(where).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneWherePopulated(where: unknown, projection?: unknown): Promise<MeInterface> {
    try {
      return await this.userModel.findOne(where)
        .select(projection)
        .populate('companies.company', '_id name')
        .lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findAllWhere(where): Promise<UserInterface[]> {
    try {
      return await this.userModel.find(where).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async insertOne(user: UserInterface, options?: QueryGenericOptionsInterface): Promise<UserInterface> {
    try {
      const docs = await this.userModel(user).save(options);
      return docs.toObject();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async updateWhere(newValuesOfUser: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<QueryUpdateInterface> {
    try {
      return await this.userModel.updateMany(where, newValuesOfUser, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneAndUpdateWhere(newValuesOfUser: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<UserInterface | QueryUpdateInterface> {
    try {
      return await this.userModel.findOneAndUpdate(where, newValuesOfUser, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async getAllCompanyUsers(companyId: string, userId: string): Promise<GetAllCompanyUsersInterface> {
    const user = await this.findOneById(userId);
    const userCompany = user.companies.find(company => company.company.toString() === companyId);
    if (!userCompany) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.COMPANY_NOT_FOUND,
      });
    }
    if (userCompany.role !== RolesEnum.MANAGER) {
      throw new ForbiddenException(defaultForbiddenResponse);
    }
    const joinedUsers = await this.findAllWhere({
      _id: {
        $ne: userId,
      },
      isActive: true,
      companies: {
        $elemMatch: {
          company: companyId,
          isActive: true,
        },
      },
    });
    const invitedUsers = await this.invitationService.findAllWhere({
      isActive: true,
      isAccepted: false,
      company: companyId,
    });
    return {
      joinedUsers: joinedUsers.map(joinedUser => ({
        fullName: joinedUser.fullName,
        userId: joinedUser._id,
        email: joinedUser.email,
      })),
      invitedUsers: invitedUsers.map(invitedUser => ({
        email: invitedUser.email,
        fullName: invitedUser.email.split('@')[0],
        invitationId: invitedUser._id,
      })),
    };
  }
}
