import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CredentialsInterface, RegisterByInvitationInterface, RegisterInterface } from '../interfaces/auth.interface';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';
import { JwtDto } from '../../../common/dto';

export class LoginDto {
  // decorator for API Documentation!
  @ApiProperty({ example: 'demo@touchdown.com' })
  // validation decorator to check for an email field!
  @IsEmail()
  readonly email: string;
  
  // decorator for API Documentation!
  @ApiProperty({ example: 'password' })
  // validation decorators for password field!
  @IsNotEmpty()
  @IsString()
  readonly password: string;
  
  constructor(credentials: CredentialsInterface) {
    if (credentials) {
      this.email = credentials.email;
      this.password = credentials.password;
    }
  }
}

export class RegisterDto {
  // decorator for API Documentation!
  @ApiProperty({
    uniqueItems: true,
    example: 'demo@touchdown.com',
  })
  // validation decorator to check for an email field!
  @IsEmail()
  email: string;
  
  // decorator for API Documentation!
  @ApiProperty({
    minLength: 8,
    maxLength: 64,
    example: 'touchdowndemo',
  })
  // validation decorators for password field!
  @IsString()
  @Length(8, 64)
  password: string;
  
  @ApiProperty({ example: 'Spacetrics' })
  @IsString()
  @IsNotEmpty()
  companyName: string;
  
  // decorator for API Documentation!
  @ApiProperty({
    format: 'Only Capital, Small English Letters And Spaces!',
    example: 'Afzaal',
  })
  // validation decorator for firstName field!
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z ]+$/i, {
    message: () => {
      return 'firstName must contains only alphabets and spaces!';
    },
  })
  firstName: string;
  
  @ApiProperty({
    format: 'Only Capital, Small English Letters And Spaces!',
    example: 'Ahmad',
  })
  // validation decorator for firstName field!
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z ]+$/i, {
    message: () => {
      return 'lastName must contains only alphabets and spaces!';
    },
  })
  lastName: string;
  
  @ApiModelPropertyOptional({
    format: 'avatar file name complete with extension',
    example: 'avatar_1572695366655_cx1e_Talha%2BMasood.png',
  })
  // validation decorator for avatar
  @IsOptional()
  @IsString()
  avatar: string;
  
  constructor(user: RegisterInterface) {
    if (user) {
      this.email = user.email;
      this.password = user.password;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.companyName = user.companyName;
      this.avatar = user.avatar;
    }
  }
}

export class RegisterByInvitationDto extends JwtDto{
  @ApiModelProperty({
    format: 'Only Capital, Small English Letters And Spaces!',
    example: 'Afzaal',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z ]+$/i, {
    message: () => {
      return 'fullName must contains only alphabets and spaces!';
    },
  })
  firstName: string;
  
  @ApiModelProperty({
    format: 'Only Capital, Small English Letters And Spaces!',
    example: 'Ahmad',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z ]+$/i, {
    message: () => {
      return 'fullName must contains only alphabets and spaces!';
    },
  })
  lastName: string;
  
  @ApiModelProperty({
    minLength: 8,
    maxLength: 64,
    example: 'workydemo',
  })
  // validation decorators for password field!
  @IsString()
  @Length(8, 64)
  password: string;
  
  constructor(data?: RegisterByInvitationInterface) {
    super();
    if(data) {
      this.jwt = data.jwt;
      this.password = data.password;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
    }
  }
}
