import { BadRequestException, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { validate } from 'class-validator';
import { HttpErrors } from '../../common/errors';
import { UserInterface } from '../../schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { ResetPasswordDto } from '../types/dto/auth.dto';

@Injectable()
export class ResetPasswordGuard extends AuthGuard('register') {
  constructor(private readonly authService: AuthService) {
    super();
  }
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const body = new ResetPasswordDto(req.body);
    const errors = await validate(body);
    if (errors.length) {
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        error: HttpErrors.BAD_REQUEST,
        message: errors,
      });
    }
    await req.logOut();
    const user: UserInterface = await this.authService.resetPassword(body);
    req.body.userId = user._id;
    const result: boolean = (await super.canActivate(context)) as boolean;
    delete req.body.userId;
    await super.logIn(req);
    return result;
  }
}
