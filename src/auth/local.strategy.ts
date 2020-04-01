import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ErrorMessages, HttpErrors } from '../common/errors';
import { UserInterface } from '../schema/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  
  async validate(email: string, password: string): Promise<UserInterface> {
    const user = await this.authService.validateUser({ email: email.trim().toLowerCase(), password });
    if (!user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        error: HttpErrors.UNAUTHORIZED,
        message: ErrorMessages.INVALID_CREDENTIALS,
      });
    }
    return user;
  }
}
