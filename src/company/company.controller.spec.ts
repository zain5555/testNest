import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

describe('Company Controller', () => {
  let controller: CompanyController;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{
        provide: CompanyService,
        useValue: {},
      }],
    }).compile();
    
    controller = module.get<CompanyController>(CompanyController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
