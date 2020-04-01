import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { HttpErrors } from './errors';
import { ErrorMessages, ResponseMessages } from './errors';

export class Constraints {
  @ApiProperty({ example: 'confirmPassword must be longer than or equal to 8 characters' })
  minLength: string;
  
  @ApiProperty({ example: 'confirmPassword must be shorter than or equal to 64 characters' })
  maxLength: string;
  
  @ApiProperty({ example: 'confirmPassword must be equal to password!' })
  passwordMatch: string;
}

export class InvalidRequestMessage {
  @ApiProperty({ example: 'RequestObject' })
  target: object;
  
  @ApiProperty({ example: 'value' })
  value: string;
  
  @ApiProperty({ example: 'confirmPassword' })
  property: string;
  
  @ApiProperty({ example: '[]' })
  children: string;
  
  @ApiProperty({ type: Constraints })
  constraints: object;
}

export class BadRequest {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.BAD_REQUEST })
  error: string;
}

export class UnauthorizedResponse {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.UNAUTHORIZED })
  error: string;
}

export class AuthFailedWithInvalidCredentials extends UnauthorizedResponse {
  @ApiProperty({ example: ErrorMessages.INVALID_CREDENTIALS })
  message: string;
}

export class GenericUnauthorizedResponse extends UnauthorizedResponse {
  @ApiProperty({ example: ErrorMessages.SESSION_EXPIRED })
  message: string;
}

export class ForbiddenResponse {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.FORBIDDEN })
  error: string;
}

export class Conflict {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.CONFLICT })
  error: string;
}

export class UnsupportedMediaTypeResponse {
  @ApiProperty({ example: HttpStatus.UNSUPPORTED_MEDIA_TYPE })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.UNSUPPORTED_MEDIA_TYPE })
  error: string;
}

export class ValidationBadRequest extends BadRequest {
  @ApiProperty({ isArray: true, type: InvalidRequestMessage })
  message: object[];
}

export class BadRequestWithUnexpectedMessageField extends BadRequest {
  @ApiProperty({ example: 'Unexpected field' })
  message: string;
}

export class InternalServerError {
  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.INTERNAL_SERVER_ERROR })
  error: string;
}

export class UnsupportedMediaTypeWithMessage extends UnsupportedMediaTypeResponse {
  @ApiProperty({ example: 'Allowed Media Types: image/png,image/jpg,image/jpeg' })
  message: string;
}

export class NotFound {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.NOT_FOUND })
  error: string;
}

export class NotFoundWithMessage extends NotFound {
  @ApiProperty({ example: 'User not found!' })
  message: string;
}

export class InternalServerErrorWithMessage extends InternalServerError {
  @ApiPropertyOptional({ example: 'Please try again later!' })
  message: string;
}

export class OKResponse {
  @ApiProperty({ example: HttpStatus.OK })
  statusCode: number;
}

export class CreatedResponse {
  @ApiProperty({ example: HttpStatus.CREATED })
  statusCode: number;
}

export class CreatedWithMessageForForgotPassword {
  @ApiProperty({ example: ResponseMessages.FORGOT_PASSWORD })
  message: string;
}

export class BadRequestForResetPassword extends BadRequest {
  @ApiProperty({ example: 'Invalid Code!' })
  message: string;
}

export const defaultInternalServerErrorResponse = {
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  error: HttpErrors.INTERNAL_SERVER_ERROR,
  message: 'Please try again later!',
};

export class NoContent {
  @ApiProperty({ example: HttpStatus.NO_CONTENT })
  statusCode: number;
}

export class UnprocessableEntityResponse {
  @ApiProperty({ example: HttpStatus.UNPROCESSABLE_ENTITY })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.UNPROCESSABLE_ENTITY })
  error: string;
}

export class ForbiddenResponseWithMessage extends ForbiddenResponse {
  @ApiProperty({ example: ErrorMessages.GENERIC_FORBIDDEN })
  message: string;
}

export const defaultForbiddenResponse = {
  statusCode: HttpStatus.FORBIDDEN,
  error: HttpErrors.FORBIDDEN,
  message: ErrorMessages.GENERIC_FORBIDDEN,
};
export const defaultNotFoundResponse = {
  statusCode: HttpStatus.NOT_FOUND,
  error: HttpErrors.NOT_FOUND,
  message: ErrorMessages.GENERIC_NOT_FOUND,
};

class GenericBadRequestConstraint {
  @ApiProperty({
    example: '_id must be a mongodb id',
  })
  isMongoId: string;
}

class GenericBadRequestMessage {
  @ApiProperty({
    example: 'requestObject',
  })
  target: object;
  
  @ApiProperty({
    example: 'asd',
  })
  value: string;
  
  @ApiProperty({
    example: '_id',
  })
  property: string;
  
  @ApiProperty({
    example: [],
  })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  
  @ApiProperty({
    type: GenericBadRequestConstraint,
  })
  constraints: GenericBadRequestConstraint;
  
}

export class GenericBadRequestResponseForIdCheck extends BadRequest {
  @ApiProperty({
    type: GenericBadRequestMessage,
    isArray: true,
  })
  message: GenericBadRequestMessage[];
}

export class DefaultForbiddenResponse {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.FORBIDDEN })
  error: string;
  
  @ApiProperty({ example: ErrorMessages.GENERIC_FORBIDDEN })
  message: string;
}

export class NotFoundResponse {
  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.NOT_FOUND })
  error: string;
}

export class PaymentRequiredResponse {
  @ApiProperty({ example: HttpStatus.PAYMENT_REQUIRED })
  statusCode: number;
  
  @ApiProperty({ example: HttpErrors.PAYMENT_REQUIRED })
  error: string;
}

