import { ApiProperty } from '@nestjs/swagger';
import { roles } from '../../../common/constants';
import { NotFound } from '../../../common/responses';
import { ErrorMessages } from '../../../common/errors';

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
  
  @ApiProperty({ example: 'manager', enum: roles })
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

export class GetAllCompanyJoinedUsersResponse {
  @ApiProperty({
    example: '5e83c8a58936cb16c3ca93c5'
  })
  userId: string;
  
  @ApiProperty({
    example: 'Afzaal Ahmad'
  })
  fullName: string;
  
  @ApiProperty({
    example: 'afzaal@creativemorph.com'
  })
  email: string;
}

export class GetAllCompanyInvitedUsersResponse {
  @ApiProperty({
    example: '5e83c8a58936cb16c3ca93c5'
  })
  invitationId: string;
  
  @ApiProperty({
    example: 'afzaal'
  })
  fullName: string;
  
  @ApiProperty({
    example: 'afzaal@creativemorph.com'
  })
  email: string;
}

export class GetAllCompanyUsersResponse {
  @ApiProperty({
    type: GetAllCompanyJoinedUsersResponse,
    isArray: true,
  })
  joinedUsers: GetAllCompanyJoinedUsersResponse;
  
  @ApiProperty({
    type: GetAllCompanyInvitedUsersResponse,
    isArray: true,
  })
  invitedUsers: GetAllCompanyInvitedUsersResponse;
}

export class UserNotFoundResponse extends NotFound {
  @ApiProperty({ example: ErrorMessages.USER_NOT_FOUND })
  message: string;
}
