import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { defaultPlan, plans, roles, RolesEnum } from '../common/constants';

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerUser: { type: Number, required: true },
  billingCycleDays: { type: Number, required: true },
  maxUsers: { type: Number, required: true },
  startedOn: { type: Date, required: true },
  expiredAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

const SubUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' }, /** from user-Collection **/
  isActive: { type: Boolean, default: true },
  role: { type: String, required: true, enum: roles, default: RolesEnum.EMPLOYEE },
}, {
  timestamps: true,
});

export const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' },
  users: { type: [SubUserSchema] },
  subscription: { type: SubscriptionSchema, required: true, default: defaultPlan },
}, {
  timestamps: true,
  autoCreate: true,
});

export interface SubUserInterface {
  _id?: string;
  user: string;
  isActive?: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionInterface {
  _id?: string;
  name: string;
  pricePerUser: number;
  billingCycleDays: number;
  maxUsers: number;
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
  users?: SubUserInterface[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
