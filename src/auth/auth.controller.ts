import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginGuard } from './guards/login.guard';
import { RequestWithUser } from '../common/interfaces';
import { LoginDto, RegisterByInvitationDto, RegisterDto } from './types/dto/auth.dto';
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
import { MeResponse } from '../user/types/responses/user.response';
import { InvitationGuard } from './guards/invitation.guard';
import { EmailDto } from '../user/types/dto/user.dto';
import { JwtDto } from '../common/dto';
import { UserInterface } from '../schema/user.schema';
import {
  ActivatingAccountUnprocessableEntityResponse,
  ActivationConflictResponse,
  ActivationUnprocessableEntityResponse,
  RegisterConflictResponse,
} from './types/responses/auth.response';
import { AcceptInvitationNotFoundResponse } from '../invitation/types/responses/invitation.response';

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
  @ApiCreatedResponse({ description: 'OK', type: Boolean })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: RegisterConflictResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async register(@Body() body: RegisterDto): Promise<boolean> {
    const user: UserInterface = await this.authService.register(body, false);
    return await this.authService.sendActivationLink(user.email, user);
  }
  
  @Get('register/verify/link')
  @ApiOkResponse({ description: 'OK', type: Boolean })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: ActivationConflictResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: ActivationUnprocessableEntityResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async getVerificationLink(@Query() query: EmailDto): Promise<boolean> {
    return this.authService.sendActivationLink(query.email);
  }
  
  @UseGuards(RegisterGuard)
  @Post('register/verify')
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiConflictResponse({ description: HttpErrors.CONFLICT, type: ActivationConflictResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: ActivatingAccountUnprocessableEntityResponse
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async verifyMe(@Req() req: RequestWithUser, @Body() body: JwtDto): Promise<MeInterface> {
    const user = await this.authService.getUser(req.user._id);
    delete user.password;
    return user;
  }
  
  @UseGuards(InvitationGuard)
  @Post('register/invite')
  @ApiCreatedResponse({ description: 'OK', type: MeResponse })
  @ApiUnprocessableEntityResponse({
    description: HttpErrors.UNPROCESSABLE_ENTITY,
    type: ActivatingAccountUnprocessableEntityResponse,
  })
  @ApiNotFoundResponse({
    description: HttpErrors.NOT_FOUND,
    type: AcceptInvitationNotFoundResponse
  })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async registerAndAcceptInvitation(@Req() req: RequestWithUser, @Body() body: RegisterByInvitationDto): Promise<MeInterface> {
    const user = await this.authService.getUser(req.user._id);
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
