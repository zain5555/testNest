import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiProperty({
    example: 'demo@touchdown.com',
    format: 'username@domain.com',
    description: 'Must be an email!',
  })
  @IsEmail()
  email: string;
}
