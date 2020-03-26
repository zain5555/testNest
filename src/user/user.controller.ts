import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MeInterface } from './types/interfaces/user.interface';
import { RequestWithUser } from '../common/interfaces';
import { EmailDto } from './types/dto/user.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { MeResponse } from './types/responses/user.response';
import { GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { HttpErrors } from '../common/errors';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  
  @UseGuards(AuthenticatedGuard)
  @ApiOkResponse({ description: 'OK', type: MeResponse })
  @ApiUnauthorizedResponse({ description: 'Unauthorized Request!', type: GenericUnauthorizedResponse })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  @Get('me')
  async getMe(@Req() request: RequestWithUser): Promise<MeInterface> {
    return this.userService.findOneByIdPopulated(request.user._id);
  }
  
  @Get('exist')
  @ApiOkResponse({ description: 'OK', type: Boolean })
  @ApiInternalServerErrorResponse({
    description: HttpErrors.INTERNAL_SERVER_ERROR,
    type: InternalServerErrorWithMessage,
  })
  async checkIfUserExists(@Query() query: EmailDto): Promise<boolean> {
    return !!await this.userService.findOneWhere({ email: query.email.trim().toLowerCase(), isActive: true });
  }
}
