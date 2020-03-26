import { ApiProperty } from '@nestjs/swagger';
import { roles } from '../../../common/constants';

export class PopulatedCompanyResponse {
  @ApiProperty({ example: '5e7be8472a863904a7cee171' })
  _id: string;
  
  @ApiProperty({ example: 'Spacetrics' })
  name: string;
}

export class PopulatedCompaniesResponse {
  @ApiProperty({ example: '5e7be8472a863904a7cee171' })
  _id: string;
  
  @ApiProperty({ type: PopulatedCompanyResponse })
  company: PopulatedCompanyResponse;
  
  @ApiProperty({ example: true })
  isActive: boolean;
  
  @ApiProperty({ example: true })
  creator: boolean;
  
  @ApiProperty({ example: 'manager', enum: roles})
  role: string;
  
  @ApiProperty({ example: '2020-03-25T23:24:55.318Z' })
  createdAt: string;
  
  @ApiProperty({ example: '2020-03-25T23:24:55.318Z' })
  updatedAt: string;
}

export class MeResponse {
  @ApiProperty({ example: '5e7be8472a863904a7cee170' })
  _id: string;
  
  @ApiProperty({ example: 'Afzaal' })
  firstName: string;
  
  @ApiProperty({ example: 'Ahmad' })
  lastName: string;
  
  @ApiProperty({ example: 'image.png' })
  avatar: string;
  
  @ApiProperty({ example: true })
  isActive: boolean;
  
  @ApiProperty({ example: 'afzaal@creativemorph.com' })
  email: string;
  
  @ApiProperty({ example: true })
  isEmailVerified: boolean;
  
  @ApiProperty({ type: PopulatedCompaniesResponse, isArray: true })
  companies: PopulatedCompaniesResponse;
  
  @ApiProperty({ example: '2020-03-25T23:24:55.318Z' })
  createdAt: string;
  
  @ApiProperty({ example: '2020-03-25T23:24:55.318Z' })
  updatedAt: string;
  
}
