import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { CompanySchema } from '../schema/company.schema';

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
          useValue: {},
        },
      ],
    }).compile();
    
    service = module.get<CompanyService>(CompanyService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
