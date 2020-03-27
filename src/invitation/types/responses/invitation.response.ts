import { Conflict, NotFound, PaymentRequiredResponse, UnprocessableEntityResponse } from '../../../common/responses';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages, ResponseMessages } from '../../../common/errors';

export class AddInvitationSuccessResponse {
  @ApiProperty({ example: 'demo@touchdown.com' })
  email: string;
  
  @ApiProperty({ example: ResponseMessages.INVITED_SUCCESSFULLY })
  message: string;
  
  @ApiProperty({ example: '5e7be8472a863904a7cee171' })
  invitationId: string;
}

export class AcceptInvitationConflictResponse extends Conflict {
  @ApiProperty({ example: ErrorMessages.ALREADY_ACCEPTED })
  message: string;
}

export class AcceptInvitationUPResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.INVITATION_REVOKED })
  message: string;
}

export class AcceptInvitationNotFoundResponse extends NotFound {
  @ApiProperty({ example: ErrorMessages.INVITATION_NOT_FOUND })
  message: string;
}
