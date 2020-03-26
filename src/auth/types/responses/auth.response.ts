import { Conflict } from '../../../common/responses';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '../../../common/errors';

export class RegisterConflictResponse extends Conflict {
  @ApiProperty({ example: ErrorMessages.EMAIL_ALREADY_EXISTS })
  message: string;
}
