import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from './guards/login.guard';
import { RequestWithUser } from '../common/interfaces';
import { LoginDto, RegisterDto, ResetPasswordDto } from './types/dto/auth.dto';
import { MeInterface } from '../user/types/interfaces/user.interface';
import { RegisterGuard } from './guards/register.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse, ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse, ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { HttpErrors } from '../common/errors';
import { AuthFailedWithInvalidCredentials, GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { MeResponse, UserNotFoundResponse } from '../user/types/responses/user.response';
import { EmailDto } from '../user/types/dto/user.dto';

import {
  RegisterConflictResponse, ResetPasswordUPResponse,
} from './types/responses/auth.response';
import { ResetPasswordGuard } from './guards/reset-password.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(LoginGuard)
  @Post('login')
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: AuthFailedWithInvalidCredentials })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async login(@Req() req: RequestWithUser, @Body() credentials: LoginDto): Promise<MeInterface> {
    const user = await this.authService.getUser(req.user._id);
    delete user.password;
    return user;
  }

  @Post('register')
  @UseGuards(RegisterGuard)
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: RegisterConflictResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async register(@Req() req: RequestWithUser, @Body() body: RegisterDto): Promise<MeInterface> {
    const user = await this.authService.getUser(req.user._id);
    delete user.password;
    return user;
  }

  @Get('/forgot-password')
  @ApiOkResponse({ description: 'OK', type: Boolean })
  @ApiNotFoundResponse({ description: HttpErrors.NOT_FOUND, type: UserNotFoundResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async forgotPassword(@Query() query: EmailDto): Promise<boolean> {
    return this.authService.forgotPassword(query.email.trim().toLowerCase());
  }

  @UseGuards(ResetPasswordGuard)
  @Post('/reset-password')
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: ResetPasswordUPResponse,
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async resetPassword(@Req() req: RequestWithUser, @Body() body: ResetPasswordDto): Promise<MeInterface> {
    const user = await this.authService.getUser(req.user._id);
    delete user.password;
    return user;
  }

  @UseGuards(AuthenticatedGuard)
  @Delete('logout')
  @ApiCreatedResponse({ description: 'OK', type: Boolean })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async logOut(@Req() req): Promise<boolean> {
    await req.logOut();
    return true;
  }

}
