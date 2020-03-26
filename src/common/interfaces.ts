import { Request } from 'express';
import { MeInterface } from '../user/types/interfaces/user.interface';

export interface RequestWithUser extends Request {
  user?: MeInterface;
  
  logIn(user: MeInterface): void;
}

export interface QueryUpdateInterface {
  n: number;
  ok: number;
  nModified: number;
  // tslint:disable-next-line:no-any
  _doc?: any;
}

export interface QueryGenericOptionsInterface {
  session?: object;
}

export interface QueryFindOneAndUpdateOptionsInterface extends QueryGenericOptionsInterface {
  upsert?: boolean;
  new?: boolean;
  lean?: boolean;
}

export interface JwtInterface {
  jwt: string;
}
