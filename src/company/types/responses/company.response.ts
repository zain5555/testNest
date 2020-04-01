import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessages } from '../../../common/errors';
import { NotFound } from '../../../common/responses';

export class CompanyNotFoundResponse extends NotFound {
  @ApiProperty({
    example: ErrorMessages.COMPANY_NOT_FOUND,
  })
  message: string;
}
