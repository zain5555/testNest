import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CompanyService } from '../company/company.service';
import { company, populatedUser, user } from '../../test/data/auth.data';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { defaultInternalServerErrorResponse } from '../common/responses';
import { StringHelper } from '../helper/string.helper';
import { MailGunHelper } from '../helper/mailgun.helper';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findOneWherePopulated: jest.fn(() => populatedUser),
            findOneByIdPopulated: jest.fn(() => populatedUser),
            findOneWhere: jest.fn(() => user),
            insertOne: jest.fn(() => user),
          },
        },
        {
          provide: CompanyService,
          useValue: {
            getSession: jest.fn(() => ({
              startTransaction: jest.fn(() => true),
              abortTransaction: jest.fn(() => true),
              commitTransaction: jest.fn(() => true),
            })),
            insertOne: jest.fn(() => company),
            findOneAndUpdateWhere: jest.fn(() => true),
          },
        },
        {
          provide: StringHelper,
          useValue: {},
        },
        {
          provide: MailGunHelper,
          useValue: {},
        },
      ],
    }).compile();
    
    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should login and return user', async () => {
    expect(await service.validateUser({ email: 'demo@touchdown.com', password: 'touchdowndemo' })).toBe(populatedUser);
  });
  
  it('should return undefined', async () => {
    jest.spyOn(userService, 'findOneWherePopulated').mockImplementationOnce(() => undefined);
    expect(await service.validateUser({ email: 'demo@touchdown.com', password: 'touchdowndemo' })).toBeUndefined();
  });
  
  it('should return user', async () => {
    expect(await service.getUser(populatedUser._id)).toBe(populatedUser);
  });
  
  it('should register new company and new user', async () => {
    jest.spyOn(userService, 'findOneWhere').mockImplementationOnce(() => null);
    expect(await service.register({
      companyName: company.name,
      email: populatedUser.email,
      lastName: populatedUser.fullName.split(' ')[1],
      firstName: populatedUser.fullName.split(' ')[0],
      password: 'touchdowndemo',
      avatar: '',
    }, false)).toMatchObject(user);
  });
  
  it('should throw conflict error', async () => {
    try {
      await service.register({
        companyName: company.name,
        email: populatedUser.email,
        lastName: populatedUser.fullName.split(' ')[1],
        firstName: populatedUser.fullName.split(' ')[0],
        password: 'touchdowndemo',
        avatar: '',
      }, false);
    } catch (e) {
      expect(e.message).toMatchObject({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.EMAIL_ALREADY_EXISTS,
      });
    }
  });
  
  it('should throw internal server error', async () => {
    jest.spyOn(userService, 'findOneWhere').mockImplementationOnce(() => undefined);
    jest.spyOn(userService, 'insertOne').mockImplementationOnce(() => {
      throw new Error('e');
    });
    try {
      await service.register({
        companyName: company.name,
        email: populatedUser.email,
        lastName: populatedUser.fullName.split(' ')[1],
        firstName: populatedUser.fullName.split(' ')[0],
        password: 'touchdowndemo',
        avatar: '',
      }, false);
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
});
