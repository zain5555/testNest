import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { JwtInterface } from './interfaces';

export class JwtDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' + '.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ' +
      '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  })
  @IsString()
  @IsNotEmpty()
  jwt: string;
  
  constructor(data?: JwtInterface) {
    if(data) {
      this.jwt = data.jwt
    }
  }
}

export class CompanyIdDto {
  @ApiProperty({ example: '5e7be8472a863904a7cee171' })
  @IsMongoId()
  companyId: string;
}
