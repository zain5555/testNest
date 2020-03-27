import { Test, TestingModule } from '@nestjs/testing';
import { StringHelper } from './string.helper';
import { ConfigService } from '../config/config.service';

describe('String Helper', () => {
  let service: StringHelper;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StringHelper,
        {
          provide: ConfigService,
          useValue: {
            jwtSecret: 'secret',
          },
        },
      ],
    }).compile();
    
    service = module.get<StringHelper>(StringHelper);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should return string of length input', async () => {
    const randomString = await service.generateRandomString(16);
    expect(randomString.length).toEqual(16);
  });
  
  it('should return random number', async () => {
    const randomNumber = await service.generateRandomNumber(6);
    expect(randomNumber.length).toEqual(6);
  });
  
  it('should generate and verify same jwt', async () => {
    const jwt = await service.signPayload({ _id: '123' }, 'me');
    expect(await service.verifyPayload(jwt)).toMatchObject({ _id: '123' });
  });
  
  it('should throw error if verification fails', async () => {
    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODk' +
      'wIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4' +
      'fwpMeJf36POk6yJV_adQssw5c';
    try {
      await service.verifyPayload(jwt);
    } catch (e) {
      expect(e).toMatchObject({
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      })
    }
  });
});
