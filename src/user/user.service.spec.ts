import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { UserSchema } from '../schema/user.schema';

describe('UserService', () => {
  let service: UserService;
  
  const userModel = mongoose.model('User', UserSchema);
  mockingoose(userModel);
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
      ],
    }).compile();
    
    service = module.get<UserService>(UserService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
