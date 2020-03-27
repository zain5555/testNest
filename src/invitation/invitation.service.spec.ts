import { Test, TestingModule } from '@nestjs/testing';
import { InvitationService } from './invitation.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { StringHelper } from '../helper/string.helper';
import { InvitationSchema } from '../schema/invitation.schema';
import { CompanyService } from '../company/company.service';
import { UserService } from '../user/user.service';

describe('InvitationService', () => {
  let service: InvitationService;
  
  const invitationModel = mongoose.model('Invitation', InvitationSchema);
  mockingoose(invitationModel);
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvitationService,
        {
          provide: StringHelper,
          useValue: {},
        },
        {
          provide: getModelToken('Invitation'),
          useValue: invitationModel,
        },
        {
          provide: CompanyService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();
    
    service = module.get<InvitationService>(InvitationService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
