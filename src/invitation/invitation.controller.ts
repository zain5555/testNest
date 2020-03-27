import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AddInvitationDto, InvitationIdDto } from './types/dto/invitation.dto';
import { RequestWithUser } from '../common/interfaces';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { HttpErrors } from '../common/errors';
import {
  AcceptInvitationConflictResponse, AcceptInvitationNotFoundResponse, AcceptInvitationUPResponse,
  AddInvitationSuccessResponse,
} from './types/responses/invitation.response';
import { uniq } from 'lodash';

@ApiTags('Invitation')
@UseGuards(AuthenticatedGuard)
@Controller('invitation')
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {
  }
  
  @Post()
  @ApiCreatedResponse({ description: 'OK', type: AddInvitationSuccessResponse, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async invite(@Req() req: RequestWithUser, @Body() body: AddInvitationDto): Promise<any> {
    return this.invitationService.invite(body.companyId, uniq(body.emails.map(email => email.trim().toLowerCase())), req.user);
  }
  
  @Post(':invitationId/accept')
  @ApiCreatedResponse({ description: 'OK', type: Boolean })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: AcceptInvitationNotFoundResponse })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: AcceptInvitationConflictResponse })
  @ApiUnprocessableEntityResponse({ description: HttpErrors.UNPROCESSABLE_ENTITY, type: AcceptInvitationUPResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async acceptInvite(@Req() req: RequestWithUser, @Param() param: InvitationIdDto): Promise<boolean> {
    return this.invitationService.acceptInvitation(param.invitationId, req.user);
  }
  
  @Post(':invitationId/resend')
  @ApiCreatedResponse({ description: 'OK', type: Boolean })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: AcceptInvitationNotFoundResponse })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: AcceptInvitationConflictResponse })
  @ApiUnprocessableEntityResponse({ description: HttpErrors.UNPROCESSABLE_ENTITY, type: AcceptInvitationUPResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async resendInvitationLink(@Param() param: InvitationIdDto, @Req() req: RequestWithUser): Promise<boolean> {
    return this.invitationService.sendInvitationLink(param.invitationId, req.user);
  }
}
