import * as moment from 'moment';

export const roles: string[] = ['admin', 'broker', 'user'];

export const enum RolesEnum {
  ADMIN = 'admin',
  BROKER = 'broker',
  USER = 'user'
}

import { SignOptions } from 'jsonwebtoken';

export const defaultJWTSignOptions: SignOptions = {
  issuer: 'touchdown',
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
    maxUsers: 0,
  },
  basic: {
    name: 'pro',
    pricePerUser: 4,
    billingCycleDays: 30,
    maxUsers: 0,
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

export const emailDomain = 'mail.trytouchdown.com';

export const numberOfEmailRetries = 3;

export enum activationEmail {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'Touchdown! Activate your account!',
  TITLE = 'Touchdown'
}

export enum invitationEmail {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'Touchdown! Invitation to touchdown!',
  TITLE = 'Touchdown'
}
export enum signUpEmailData {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'Touchdown! Welcome to touchdown!',
  TITLE = 'Touchdown'
}
export enum newTouchdownEmailData {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'New Touchdown!',
  TITLE = 'Touchdown'
}
export enum newFeedbackEmailData {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'New Feedback!',
  TITLE = 'Touchdown'
}

export enum forgotPasswordEmailData {
  FROM = 'noreply@trytouchdown.com',
  SUBJECT = 'Reset your password!',
  TITLE = 'Touchdown'
}

export const goalsStatus = ['InComplete', 'InProgress', 'Done'];

export enum GoalStatus {
  IN_COMPLETE = 'InComplete',
  IN_PROGRESS = 'InProgress',
  DONE = 'DONE'
}

export const defaultTouchDownTimeInDays = -1;

export enum DefaultPaginationLimits {
  TOUCHDOWN = 10
}

export const listSortingOrders = ['ascending', 'descending'];

export enum SortOrder {
  ASCENDING = 'ascending',
  DESCENDING = 'descending'
}

export const touchdownSortByOptions = ['createdAt'];

export const defaultTouchdownSortBy = 'createdAt';

export const defaultTouchdownSortOrder = -1;
