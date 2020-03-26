import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import mockingoose from 'mockingoose';
import { UserSchema } from '../schema/user.schema';
import { company, populatedUser, user } from '../../test/data/auth.data';
import { RolesEnum } from '../common/constants';
import { defaultInternalServerErrorResponse } from '../common/responses';

describe('UserService', () => {
  let service: UserService;
  let userOverRideModel: any;
  
  const userModel = mongoose.model('User', UserSchema);
  mockingoose(userModel);
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: userModel,
        },
      ],
    }).compile();
    
    service = module.get<UserService>(UserService);
    userOverRideModel = module.get(getModelToken('User'));
  });
  
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  
  it('should return inserted user', async () => {
    mockingoose(userModel).toReturn(user, 'save');
    const insertedUser = await service.insertOne({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isEmailVerified: true,
      companies: [{
        creator: true,
        isActive: true,
        company: company._id,
        role: RolesEnum.MANAGER,
      }],
    });
    expect(JSON.parse(JSON.stringify(insertedUser))).toMatchObject(user);
  });
  
  it('should return internal server error instead of adding', async () => {
    mockingoose(userModel).toReturn(Error('e'), 'save');
    try {
      await service.insertOne({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        isEmailVerified: true,
        companies: [{
          creator: true,
          isActive: true,
          company: company._id,
          role: RolesEnum.MANAGER,
        }],
      });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return updated user', async () => {
    mockingoose(userModel).toReturn(user, 'findOneAndUpdate');
    const updatedUser = await service.findOneAndUpdateWhere({
      _id: user._id,
    }, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isEmailVerified: true,
      companies: [{
        creator: true,
        isActive: true,
        company: company._id,
        role: RolesEnum.MANAGER,
      }],
    });
    expect(JSON.parse(JSON.stringify(updatedUser))).toMatchObject(user);
  });
  
  it('should return internal server error instead of updating', async () => {
    mockingoose(userModel).toReturn(Error('e'), 'findOneAndUpdate');
    try {
      await service.findOneAndUpdateWhere({
        _id: user._id,
      }, {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        isEmailVerified: true,
        companies: [{
          creator: true,
          isActive: true,
          company: company._id,
          role: RolesEnum.MANAGER,
        }],
      });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return user', async () => {
    mockingoose(userModel).toReturn(user, 'findOne');
    const userFound = await service.findOneWhere({ _id: user._id });
    expect(JSON.parse(JSON.stringify(userFound))).toMatchObject(user);
  });
  
  it('should return internal server error instead of user', async () => {
    mockingoose(userModel).toReturn(Error('e'), 'findOne');
    try {
      await service.findOneWhere({ _id: user._id });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return users', async () => {
    mockingoose(userModel).toReturn([user], 'find');
    const usersFound = await service.findAllWhere({ _id: user._id });
    expect(JSON.parse(JSON.stringify(usersFound))).toMatchObject([user]);
  });
  
  it('should return internal server error instead of users', async () => {
    mockingoose(userModel).toReturn(Error('e'), 'find');
    try {
      await service.findAllWhere({ _id: user._id });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return user findOne', async () => {
    mockingoose(userModel).toReturn(user, 'findOne');
    const userFound = await service.findOneWherePopulated({ _id: user._id });
    expect(JSON.parse(JSON.stringify(userFound))).toMatchObject(user);
  });
  
  it('should return internal server error instead of user findOne', async () => {
    mockingoose(userModel).toReturn(Error('e'), 'findOne');
    try {
      await service.findOneWherePopulated({ _id: user._id });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return user findbyId', async () => {
    jest.spyOn(userOverRideModel, 'findById').mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        lean: jest.fn(() => user),
      })),
    }));
    const userFound = await service.findOneById(user._id);
    expect(JSON.parse(JSON.stringify(userFound))).toMatchObject(user);
  });
  
  it('should return internal server error instead of user findById', async () => {
    jest.spyOn(userOverRideModel, 'findById').mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        lean: jest.fn(() => {
          throw Error('e');
        }),
      })),
    }));
    try {
      await service.findOneById(user._id);
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return populated user findbyId', async () => {
    jest.spyOn(userOverRideModel, 'findById').mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        populate: jest.fn(() => ({
          lean: jest.fn(() => populatedUser),
        })),
      })),
    }));
    const userFound = await service.findOneByIdPopulated(user._id);
    expect(JSON.parse(JSON.stringify(userFound))).toMatchObject(populatedUser);
  });
  
  it('should return internal server error instead of populated user by findById', async () => {
    jest.spyOn(userOverRideModel, 'findById').mockImplementationOnce(() => ({
      select: jest.fn(() => ({
        populate: jest.fn(() => ({
          lean: jest.fn(() => {
            throw Error('e');
          }),
        })),
      })),
    }));
    try {
      await service.findOneByIdPopulated(user._id);
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
  
  it('should return updated user or users', async () => {
    jest.spyOn(userOverRideModel, 'updateMany').mockImplementationOnce(() => user);
    const updatedUser = await service.updateWhere({
      isEmailVerified: true,
    }, {
      _id: user._id,
    });
    expect(JSON.parse(JSON.stringify(updatedUser))).toMatchObject(user);
  });
  
  it('should return internal server error instead of updating user', async () => {
    jest.spyOn(userOverRideModel, 'updateMany').mockImplementationOnce(() => {
      throw Error('e');
    });
    try {
      await service.updateWhere({
        isEmailVerified: true,
      }, {
        _id: user._id,
      });
    } catch (e) {
      expect(e.message).toMatchObject(defaultInternalServerErrorResponse);
    }
  });
});
