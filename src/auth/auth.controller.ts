import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from './guards/login.guard';
import { RequestWithUser } from '../common/interfaces';
import { LoginDto, RegisterDto } from './types/dto/auth.dto';
import { MeInterface } from '../user/types/interfaces/user.interface';
import { RegisterGuard } from './guards/register.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { HttpErrors } from '../common/errors';
import { AuthFailedWithInvalidCredentials, GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { MeResponse } from '../user/types/responses/user.response';

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
  async login(@Req() request: RequestWithUser, @Body() credentials: LoginDto): Promise<MeInterface> {
    const user = request.user;
    delete user.password;
    return user;
  }
  
  @UseGuards(RegisterGuard)
  @Post('register')
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async register(@Req() request: RequestWithUser, @Body() body: RegisterDto): Promise<MeInterface> {
    const user = request.user;
    delete user.password;
    return user;
  }
  
  @UseGuards(AuthenticatedGuard)
  @Post('logout')
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
