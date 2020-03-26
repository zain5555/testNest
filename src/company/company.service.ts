import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyInterface } from '../schema/company.schema';
import { UserInterface } from '../schema/user.schema';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { QueryGenericOptionsInterface } from '../common/interfaces';

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
}
