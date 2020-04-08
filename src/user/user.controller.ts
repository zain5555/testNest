import { Controller, Get,Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  // ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  // ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {  MeInterface } from './types/interfaces/user.interface';
import { RequestWithUser } from '../common/interfaces';
// import { EmailDto } from './types/dto/user.dto';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import {  MeResponse } from './types/responses/user.response';
import {  GenericUnauthorizedResponse, InternalServerErrorWithMessage } from '../common/responses';
import { HttpErrors } from '../common/errors';
// import { CompanyIdDto } from '../common/dto';
// import { CompanyNotFoundResponse } from '../company/types/responses/company.response';

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
  
}
