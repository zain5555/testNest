import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { MeInterface } from '../user/types/interfaces/user.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: MeInterface, done: (err: Error, user: MeInterface) => void): void {
    done(undefined, user);
  }
  deserializeUser(payload: string, done: (err: Error, payload: string) => void): void {
    done(undefined, payload);
  }
}
