import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TouchdownInterface } from '../schema/touchdown.schema';
import { defaultForbiddenResponse, defaultInternalServerErrorResponse } from '../common/responses';
import { QueryFindOneAndUpdateOptionsInterface, QueryGenericOptionsInterface, QueryUpdateInterface } from '../common/interfaces';
import {
  AddCommentAndRatingInterface,
  AddTouchDownInterface,
  GetAllDataInterface,
  GetAllPaginatedQueryInterface,
  GetAllPaginatedResponseInterface, GetLastResponseInterface,
  GetOneTouchdownResponseInterface,
  PopulatedTouchdownInterface, UpdateGoalsInterface,
} from './types/interfaces/touchdown.interface';
import { UserInterface } from '../schema/user.schema';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { DefaultPaginationLimits, defaultTouchDownTimeInDays, RolesEnum } from '../common/constants';
import { UserService } from '../user/user.service';
import * as moment from 'moment';
import { MailGunHelper } from '../helper/mailgun.helper';
import { CompanyService } from '../company/company.service';

@Injectable()
export class TouchdownService {
  constructor(
    @InjectModel('Touchdown') private readonly touchdownModel: Model<TouchdownInterface>,
    private readonly userService: UserService,
    private readonly mailGunHelper: MailGunHelper,
    private readonly companyService: CompanyService,
  ) {
  }
  
  async findOneByIdPopulated(id: string, projection?: unknown): Promise<PopulatedTouchdownInterface> {
    try {
      return await this.touchdownModel.findById(id)
        .select(projection)
        .populate('previousTouchdown')
        .populate('createdBy', '_id fullName')
        .lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneById(id: string, projection?: unknown): Promise<TouchdownInterface> {
    try {
      return await this.touchdownModel.findById(id).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneWhere(where: unknown, projection?: unknown): Promise<TouchdownInterface> {
    try {
      return await this.touchdownModel.findOne(where).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneWherePopulated(where: unknown, projection?: unknown): Promise<PopulatedTouchdownInterface> {
    try {
      return await this.touchdownModel.findOne(where)
        .select(projection)
        .populate('previousTouchdown')
        .populate('createdBy', '_id fullName')
        .lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findAllWhere(where: any, limit?: number, projection?: any): Promise<TouchdownInterface[]> {
    try {
      return await this.touchdownModel.find(where).sort('-createdAt').limit(limit).select(projection).lean();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async insertOne(touchdown: TouchdownInterface, options?: QueryGenericOptionsInterface): Promise<TouchdownInterface> {
    try {
      const docs = await this.touchdownModel(touchdown).save(options);
      return docs.toObject();
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async findOneAndUpdateWhere(newValuesOfTouchdown: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<TouchdownInterface | QueryUpdateInterface> {
    try {
      return await this.touchdownModel.findOneAndUpdate(where, newValuesOfTouchdown, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async updateWhere(newValuesOfTouchdown: unknown, where: unknown, options?: QueryFindOneAndUpdateOptionsInterface): Promise<QueryUpdateInterface> {
    try {
      return await this.touchdownModel.updateMany(where, newValuesOfTouchdown, options);
    } catch (e) {
      console.warn(e);
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async sendEmailToEmployees(touchdown: TouchdownInterface, userId: string, userName: string): Promise<boolean> {
    const company = await this.companyService.findOneWhere({
      _id: touchdown.company,
    });
    if (!company) {
      return false;
    }
    const allEmployees = await this.userService.findAllWhere({
      _id: {
        $ne: userId,
      },
      isActive: true,
      isEmailVerified: true,
      companies: {
        $elemMatch: {
          company: touchdown.company,
          isActive: true,
        },
      },
    });
    for (const employee of allEmployees) {
      this.mailGunHelper.newTouchdownEmail(employee.email, employee.fullName, userName, touchdown._id.toString(), company.name);
    }
    return true;
  }
  
  async sendEmailToManager(managerId: string, companyId: string, touchdownId: string): Promise<boolean> {
    const company = await this.companyService.findOneWhere({
      _id: companyId,
      isActive: true,
    });
    const user = await this.userService.findOneWhere({
      _id: managerId,
      isActive: true,
      companies: {
        $elemMatch: {
          company: companyId,
          isActive: true,
        },
      },
    });
    if (!company || !user || !user.isActive || !user.isEmailVerified) {
      return false;
    }
    this.mailGunHelper.newFeedbackEmail(user.email, user.fullName, touchdownId, company.name);
    return true;
  }
  
  async getLast(companyId: string, userId: string, user?: UserInterface): Promise<GetLastResponseInterface | boolean> {
    if (!user) {
      user = await this.userService.findOneById(userId);
    }
    const userCompany = user.companies.find(company => company.company.toString() === companyId);
    if (!userCompany) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.COMPANY_NOT_FOUND,
      });
    }
    if (userCompany.role !== RolesEnum.MANAGER) {
      throw new ForbiddenException(defaultForbiddenResponse);
    }
    const previousTouchdown = await this.findAllWhere({
      createdBy: user._id,
      isActive: true,
      company: companyId,
    }, 1);
    if (previousTouchdown && previousTouchdown.length) {
      return {
        _id: previousTouchdown[0]._id,
        goals: previousTouchdown[0].goals,
        createdAt: previousTouchdown[0].createdAt,
        startDate: previousTouchdown[0].startDate,
      };
    }
    return false;
  }
  
  async getOne(touchdownId: string, userId: string): Promise<GetOneTouchdownResponseInterface> {
    const touchdown: PopulatedTouchdownInterface = await this.findOneByIdPopulated(touchdownId);
    const user: UserInterface = await this.userService.findOneById(userId);
    const userCompany = user.companies.find(company => company.company.toString() === touchdown.company.toString());
    if (!userCompany || !touchdown || !touchdown.isActive) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.TOUCHDOWN_NOT_FOUND,
      });
    }
    const response: GetOneTouchdownResponseInterface = {
      _id: touchdown._id,
      createdBy: touchdown.createdBy,
      primaryMetric: touchdown.primaryMetric,
      description: touchdown.description,
      goals: touchdown.goals,
      isActive: touchdown.isActive,
      previousGoals: touchdown.previousTouchdown.goals,
      startDate: touchdown.startDate,
      ratingsAndComments: userCompany.role === RolesEnum.MANAGER && user._id.toString() === touchdown.createdBy._id.toString() ? touchdown.ratingsAndComments.map(obj => {
        return {
          rate: obj.rate,
          comment: obj.comment,
          createdAt: obj.createdAt,
        };
      }) : touchdown.ratingsAndComments.filter(obj => obj.user.toString() === user._id.toString()).map(obj => {
        return {
          rate: obj.rate,
          comment: obj.comment,
          createdAt: obj.createdAt,
        };
      }),
      createdAt: touchdown.createdAt,
    };
    if (userCompany.role === RolesEnum.MANAGER) {
      response.averageRating = touchdown.averageRating;
    }
    return response;
  }
  
  async getAll(query: GetAllPaginatedQueryInterface, userId: string): Promise<GetAllPaginatedResponseInterface> {
    const user: UserInterface = await this.userService.findOneById(userId);
    const userCompany = user.companies.find(company => company.company.toString() === query.companyId);
    if (!userCompany) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.COMPANY_NOT_FOUND,
      });
    }
    const where: any = {
      company: query.companyId,
      isActive: true,
    };
    if (query.cursor) {
      where.createdAt = {
        $lt: query.cursor,
      };
    }
    const limit = query.limit ?? DefaultPaginationLimits.TOUCHDOWN;
    if (userCompany.role === RolesEnum.MANAGER) {
      where.user = user._id;
    }
    let response: GetAllPaginatedResponseInterface = {
      data: [],
      hasMore: false,
      cursor: '',
    };
    const touchdowns = await this.findAllWhere(where, limit + 1);
    const touchdownResponse: GetAllDataInterface[] = touchdowns.map(touchdown => ({
      _id: touchdown._id,
      primaryMetric: touchdown.primaryMetric,
      rate: userCompany.role === RolesEnum.MANAGER
        ? touchdown.averageRating
        : touchdown.ratingsAndComments.length
          ? touchdown.ratingsAndComments.find(obj => obj.user.toString() === user._id.toString())?.rate || 0
          : 0,
      startDate: touchdown.startDate,
      createdAt: touchdown.createdAt,
    }));
    if (touchdowns.length === limit + 1) {
      touchdownResponse.pop();
      response = {
        data: touchdownResponse,
        cursor: touchdownResponse[touchdownResponse.length - 1].createdAt,
        hasMore: true,
      };
    } else {
      response.data = touchdownResponse;
    }
    return response;
  }
  
  async addOne(data: AddTouchDownInterface, userId: string): Promise<GetOneTouchdownResponseInterface> {
    const user = await this.userService.findOneById(userId);
    let lastTouchdown = await this.getLast(data.companyId, userId, user) as GetLastResponseInterface;
    if (lastTouchdown && moment(moment(Date.now()).utc().startOf('day')).diff(moment(moment(lastTouchdown.createdAt).utc().startOf('day')), 'days') < defaultTouchDownTimeInDays) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessages.TOUCHDOWN_INSERTION_NOT_ALLOWED,
      });
    }
    const updatedValues: any = {
      $set: {},
    };
    if (lastTouchdown && data.previousGoals && data.previousGoals.length) {
      for (const previousGoal of data.previousGoals) {
        const goalIndex = lastTouchdown.goals.findIndex(goal => goal._id.toString() === previousGoal._id);
        if (goalIndex > -1) {
          updatedValues.$set = {
            ...updatedValues.$set,
            ['goals.' + goalIndex + '.status']: previousGoal.status,
          };
        }
      }
    }
    let session;
    try {
      session = await this.touchdownModel.db.startSession();
      await session.startTransaction();
      if (Object.keys(updatedValues.$set).length) {
        lastTouchdown = await this.findOneAndUpdateWhere(updatedValues, {
          _id: lastTouchdown._id,
        }, {
          session,
          new: true,
          lean: true,
        }) as TouchdownInterface;
      }
      const touchdown = await this.insertOne({
        company: data.companyId,
        primaryMetric: data.primaryMetric,
        previousTouchdown: lastTouchdown ? lastTouchdown._id : null,
        goals: data.goals.map(goal => ({
          goal,
        })),
        description: data.description,
        startDate: moment(data.startDate).format('YYYY-MM-DD'),
        createdBy: userId,
      }, { session });
      await session.commitTransaction();
      this.sendEmailToEmployees(touchdown, user._id.toString(), user.fullName);
      return {
        _id: touchdown._id,
        primaryMetric: touchdown.primaryMetric,
        description: touchdown.description,
        averageRating: touchdown.averageRating,
        isActive: touchdown.isActive,
        startDate: touchdown.startDate,
        createdBy: {
          _id: user._id,
          fullName: user.fullName,
        },
        createdAt: touchdown.createdAt,
        ratingsAndComments: [],
        previousGoals: lastTouchdown && lastTouchdown.goals ? lastTouchdown.goals : [],
        goals: touchdown.goals,
      };
    } catch (e) {
      console.warn(e);
      session.abortTransaction();
      throw new InternalServerErrorException(defaultInternalServerErrorResponse);
    }
  }
  
  async addFeedback(data: AddCommentAndRatingInterface, touchdownId: string, userId: string): Promise<boolean> {
    const touchdown = await this.findOneById(touchdownId);
    const user = await this.userService.findOneById(userId);
    const userCompany = user.companies.find(company => company.company.toString() === touchdown.company.toString());
    if (!userCompany || !touchdown) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.TOUCHDOWN_NOT_FOUND,
      });
    }
    if (touchdown.ratingsAndComments.find(obj => obj.user.toString() === user._id.toString())) {
      throw new ConflictException({
        statusCode: HttpStatus.CONFLICT,
        error: HttpErrors.CONFLICT,
        message: ErrorMessages.CANNOT_UPDATE_COMMENT,
      });
    }
    if (touchdown.createdBy.toString() === user._id.toString()) {
      throw new UnprocessableEntityException({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        error: HttpErrors.UNPROCESSABLE_ENTITY,
        message: ErrorMessages.CANNOT_LEAVE_COMMENT_ON_YOUR_OWN_TOUCHDOWN,
      });
    }
    const updatedStatus = await this.updateWhere({
      $push: {
        ratingsAndComments: {
          ...data,
          user: user._id,
        },
      },
      averageRating: touchdown.averageRating ? touchdown.averageRating + ((data.rate - touchdown.averageRating) / (touchdown.ratingsAndComments.length + 1)) : data.rate,
    }, {
      _id: touchdownId,
    });
    if (updatedStatus.n && updatedStatus.nModified) {
      this.sendEmailToManager(touchdown.createdBy, touchdown.company, touchdown._id);
      return true;
    }
    throw new InternalServerErrorException(defaultInternalServerErrorResponse);
  }
  
  async updatePreviousGoals(data: UpdateGoalsInterface, touchdownId: string, userId: string): Promise<any> {
    const touchdown = await this.findOneById(touchdownId);
    const user = await this.userService.findOneById(userId);
    const userCompany = user.companies.find(company => company.company.toString() === touchdown.company.toString());
    if (!userCompany || !touchdown) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.TOUCHDOWN_NOT_FOUND,
      });
    }
    if (userCompany.role !== RolesEnum.MANAGER) {
      throw new ForbiddenException(defaultForbiddenResponse);
    }
    if (!touchdown.previousTouchdown) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        error: HttpErrors.NOT_FOUND,
        message: ErrorMessages.LAST_TOUCHDOWN_NOT_FOUND,
      });
    }
    const updatedStatus = await this.updateWhere({
      $set: {
        'goals.$.status': data.status,
      },
    }, {
      _id: touchdown.previousTouchdown,
      'goals._id': data._id,
    });
    if (updatedStatus.n && updatedStatus.nModified) {
      return true;
    }
    throw new InternalServerErrorException(defaultInternalServerErrorResponse);
  }
}
