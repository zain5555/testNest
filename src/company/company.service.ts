import { ForbiddenException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyInterface, SubUserInterface } from '../schema/company.schema';
import { defaultForbiddenResponse, defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { RolesEnum } from '../common/constants';

@Injectable()
export class CompanyService {
  constructor(@InjectModel('Company') private readonly companyModel: Model<CompanyInterface>) {
  }
  
  async findOneWhere(where: unknown, projection?: unknown): Promise<CompanyInterface> {
    try {
      return await this.companyModel.findOne(where).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async insertOne(company: CompanyInterface, options?: QueryGenericOptionsInterface): Promise<CompanyInterface> {
    try {
      const docs = await this.companyModel(company).save(options);
      return docs.toObject();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async getSession(): Promise<any> {
    return this.companyModel.db.startSession();
  }
  
  async findOneAndUpdateWhere(newValuesOfCompany: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<CompanyInterface | QueryUpdateInterface> {
    try {
      return await this.companyModel.findOneAndUpdate(where, newValuesOfCompany, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async getIfCompanyExists(companyId: string, userId: string): Promise<CompanyInterface> {
    const company = await this.findOneWhere({
      _id: companyId,
      isActive: true,
      users: {
        $elemMatch: {
          user: userId,
          isActive: true,
        },
      },
    });
    if (!company) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.COMPANY_NOT_FOUND,
      });
    }
    return company;
  }
  
  async getIfCompanyExistsAndIAmManager(companyId: string, userId: string): Promise<CompanyInterface> {
    const company = await this.getIfCompanyExists(companyId, userId);
    const user: SubUserInterface = company.users.find(user => user.user.toString() === userId.toString() && user.role === RolesEnum.MANAGER && user.isActive);
    if (!user) {
      throw new ForbiddenException(defaultForbiddenResponse)
    }
    return company;
  }
}
