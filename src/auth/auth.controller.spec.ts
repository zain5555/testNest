import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { InvitationService } from '../invitation/invitation.service';

describe('Auth Controller', () => {
  let controller: AuthController;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {},
      }, {
        provide: InvitationService,
        useValue: {},
      }],
    }).compile();
    
    controller = module.get<AuthController>(AuthController);
  });
  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
