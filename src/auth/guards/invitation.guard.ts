import { BadRequestException, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { RegisterByInvitationDto } from '../../auth/types/dto/auth.dto';
import { validate } from 'class-validator';
import { HttpErrors } from '../../common/errors';
import { AuthGuard } from '@nestjs/passport';
import { UserInterface } from '../../schema/user.schema';
import { InvitationService } from '../../invitation/invitation.service';
import { RegisterByInvitationInterface } from '../types/interfaces/auth.interface';
import { InvitationInterface } from '../../schema/invitation.schema';

@Injectable()
export class InvitationGuard extends AuthGuard('register') {
  constructor(
    private readonly authService: AuthService,
    private readonly invitationService: InvitationService,
  ) {
    super();
  }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const invitationData: RegisterByInvitationInterface = new RegisterByInvitationDto(req.body);
    const errors = await validate(invitationData);
    if (errors.length) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: HttpErrors.BAD_REQUEST,
        message: errors,
      });
    }
    const invitation: InvitationInterface = await this.invitationService.checkInvitationValidity(invitationData.jwt);
    const user: UserInterface = await this.authService.register({
      firstName: invitationData.firstName,
      lastName: invitationData.lastName,
      password: invitationData.password,
      email: invitation.email,
    }, true);
    await this.invitationService.acceptMyInvite(invitation, user._id);
    req.body.userId = user._id;
    const result: boolean = (await super.canActivate(context)) as boolean;
    delete req.body.userId;
    await super.logIn(req);
    return result;
  }
}
