import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { TouchdownService } from './touchdown.service';
import { RequestWithUser } from '../common/interfaces';
import { AddCommentAndRatingDto, AddTouchdownDto, GetAllPaginatedDto, TouchdownIdDto, UpdateGoalDto } from './types/dto/touchdown.dto';
import { GetAllPaginatedResponseInterface, GetOneTouchdownResponseInterface } from './types/interfaces/touchdown.interface';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CompanyIdDto } from '../common/dto';
import {
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse, ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  AddFeedbackConflictResponse, AddFeedbackUPResponse, GetAllPaginatedResponse,
  GetLastTouchdownResponse, GetOneTouchdownResponse,
  TouchdownInsertionUPResponse,
  TouchdownNotFoundResponse,
} from './types/responses/touchdown.response';
import { DefaultForbiddenResponse, GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { HttpErrors } from '../common/errors';
import { CompanyNotFoundResponse } from '../company/types/responses/company.response';

@ApiTags('Touchdown')
@UseGuards(AuthenticatedGuard)
@Controller('touchdown')
export class TouchdownController {
  constructor(private readonly touchdownService: TouchdownService) {
  }
  
  @Get('/last')
  @ApiOkResponse({ description: 'OK', type: GetLastTouchdownResponse })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: CompanyNotFoundResponse })
  @ApiForbiddenResponse({ description: HttpErrors.FORBIDDEN, type: DefaultForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async getLastTouchdown(@Req() req: RequestWithUser, @Query() query: CompanyIdDto, @Res() res: any): Promise<boolean> {
    const lastTouchdown = await this.touchdownService.getLast(query.companyId, req.user._id);
    lastTouchdown ? res.status(HttpStatus.OK).send(lastTouchdown) : res.status(HttpStatus.NO_CONTENT).send();
    return true;
  }
  
  @Get(':touchdownId')
  @ApiOkResponse({ description: 'OK', type: GetOneTouchdownResponse })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: TouchdownNotFoundResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async getOneTouchdown(@Req() req: RequestWithUser, @Param() param: TouchdownIdDto): Promise<GetOneTouchdownResponseInterface> {
    return this.touchdownService.getOne(param.touchdownId, req.user._id);
  }
  
  @Get()
  @ApiOkResponse({ description: 'OK', type: GetAllPaginatedResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: CompanyNotFoundResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async getAllTouchdowns(@Req() req: RequestWithUser, @Query() query: GetAllPaginatedDto): Promise<GetAllPaginatedResponseInterface> {
    return this.touchdownService.getAll(query, req.user._id);
  }
  
  @Post()
  @ApiOkResponse({ description: 'OK', type: GetOneTouchdownResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: TouchdownInsertionUPResponse,
  })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: CompanyNotFoundResponse })
  @ApiForbiddenResponse({ description: HttpErrors.FORBIDDEN, type: DefaultForbiddenResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async addTouchdown(@Req() req: RequestWithUser, @Body() body: AddTouchdownDto): Promise<GetOneTouchdownResponseInterface> {
    return this.touchdownService.addOne(body, req.user._id);
  }
  
  @Patch(':touchdownId/feedback')
  @ApiNoContentResponse({ description: 'OK' })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: AddFeedbackConflictResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: AddFeedbackUPResponse,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: TouchdownNotFoundResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async addFeedback(@Req() req: RequestWithUser, @Param() param: TouchdownIdDto, @Body() body: AddCommentAndRatingDto): Promise<boolean> {
    return this.touchdownService.addFeedback(body, param.touchdownId, req.user._id);
  }
  
  @Patch(':touchdownId')
  @ApiNoContentResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: TouchdownNotFoundResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePreviousGoal(@Req() req: RequestWithUser, @Param() param: TouchdownIdDto, @Body() body: UpdateGoalDto): Promise<boolean> {
    return this.touchdownService.updatePreviousGoals(body, param.touchdownId, req.user._id);
  }
}
