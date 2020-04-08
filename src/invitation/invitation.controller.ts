import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { AddInvitationDto } from './types/dto/invitation.dto';
import { RequestWithUser } from '../common/interfaces';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import {
  // ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpErrors } from '../common/errors';
import { GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';


import {
  AddInvitationSuccessResponse,
} from './types/responses/invitation.response';

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
    return this.invitationService.invite(body.companyId, body.email);
  }


}