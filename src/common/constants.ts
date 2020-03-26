import * as moment from 'moment';

export const roles: string[] = ['manager', 'employee'];

export const enum RolesEnum {
  MANAGER = 'manager',
  EMPLOYEE = 'employee'
}

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

export const plans = {
  trial: {
    name: 'trial',
    pricePerUser: 0,
    billingCycleDays: 49,
    maxUsers: 4,
  },
  basic: {
    name: 'basic',
    pricePerUser: 5,
    billingCycleDays: 30,
    maxUsers: 10,
  },
};

export const defaultPlan = {
  ...plans.trial,
  startedOn: moment(Date.now()).utc(),
  expiredAt: moment(Date.now()).utc().add(plans.trial.billingCycleDays, 'days'),
};

export const enum StrategyNames {
  REGISTER_STRATEGY = 'register'
}
