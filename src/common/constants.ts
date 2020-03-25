export const roles: string[] = ['manager', 'employee'];

import { SignOptions } from 'jsonwebtoken';

export const defaultJWTSignOptions: SignOptions = {
  issuer: 'worky',
  algorithm: 'HS256',
};

export const enum nodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
  PROVISION = 'provision',
  INSPECTION = 'inspection',
}

export const sessionName = 'nowdhcuot';

export const systemName = 'touchdown';
