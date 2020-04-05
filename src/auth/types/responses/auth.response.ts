import { Conflict, UnprocessableEntityResponse } from '../../../common/responses';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '../../../common/errors';

export class RegisterConflictResponse extends Conflict {
  @ApiProperty({
    example: ErrorMessages.EMAIL_ALREADY_EXISTS,
    enum: [ErrorMessages.EMAIL_ALREADY_EXISTS, ErrorMessages.ALREADY_VERIFIED],
  })
  message: string;
}

export class ActivationUnprocessableEntityResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.REGISTER_FIRST })
  message: string;
}

export class ActivationConflictResponse extends Conflict {
  @ApiProperty({ example: ErrorMessages.ALREADY_VERIFIED })
  message: string;
}

export class ActivatingAccountUnprocessableEntityResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.INVALID_JWT })
  message: string;
}

export class ResetPasswordUPResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.INVALID_JWT })
  message: string;
}
