import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { CompanySchema } from '../schema/company.schema';
import { company, user } from '../../test/data/auth.data';
import { RolesEnum } from '../common/constants';
import { defaultInternalServerErrorResponse } from '../common/responses';

describe('CompanyService', () => {
  let service: CompanyService;
  const companyModel = mongoose.model('Company', CompanySchema);
  mockingoose(companyModel);
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: getModelToken('Company'),
          useValue: companyModel,
        },
      ],
    }).compile();
    
    service = module.get<CompanyService>(CompanyService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should return inserted company', async () => {
    mockingoose(companyModel).toReturn(company, 'save');
    const insertedCompany = await service.insertOne({
      name: company.name,
      isActive: true,
      subscription: company.subscription,
    });
    expect(JSON.parse(JSON.stringify(insertedCompany))).toMatchObject(company);
  });
  
  it('should return internal server error instead of adding', async () => {
    mockingoose(companyModel).toReturn(Error('e'), 'save');
    try {
      await service.insertOne({
        name: company.name,
        isActive: true,
        subscription: company.subscription,
      });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return company', async () => {
    mockingoose(companyModel).toReturn(company, 'findOne');
    const companyFound = await service.findOneWhere({ _id: company._id });
    expect(JSON.parse(JSON.stringify(companyFound))).toMatchObject(company);
  });
  
  it('should return internal server error instead of company', async () => {
    mockingoose( companyModel).toReturn(Error('e'), 'findOne');
    try {
      await service.findOneWhere({ _id: company._id });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
});
