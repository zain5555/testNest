import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { defaultPlan, plans, roles } from '../common/constants';

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerUser: { type: String, required: true },
  billingCycleDays: { type: Number, required: true },
  maxUsers: { type: Number, required: true },
  startedOn: { type: Date, required: true },
  expiredAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  subscription: { type: SubscriptionSchema, required: true, default: defaultPlan },
}, {
  timestamps: true,
  autoCreate: true,
});

export interface SubscriptionInterface {
  _id?: string;
  name: string;
  pricePerUser: string;
  billingCycleDays: string;
  maxUsers: string;
  startedOn: string;
  expiredAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInterface {
  _id?: string;
  name: string;
  creator?: string;
  subscription?: SubscriptionInterface;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
