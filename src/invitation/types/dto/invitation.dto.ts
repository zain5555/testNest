import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId } from 'class-validator';

export class AddInvitationDto {
  @ApiProperty({ example: '5e7be8472a863904a7cee171' })
  @IsMongoId()
  companyId: string;
  
  @ApiProperty({ example: 'demo@touchdown.com' })
  @IsEmail()
  email: string;
}

export class InvitationIdDto {
  @ApiProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  invitationId: string;
}
