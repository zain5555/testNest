import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserInterface } from '../schema/user.schema';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import { MeInterface } from './types/interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) {
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
}
