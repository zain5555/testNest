import { Request } from 'express';
import { UserInterface } from '../schema/user.schema';

export interface RequestWithUser extends Request {
  user?: UserInterface;
  
  logIn(user: UserInterface): void;
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
