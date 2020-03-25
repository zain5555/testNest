import * as mongoose from 'mongoose';
import * as moment from 'moment';
import { defaultPlan, plans, roles } from '../common/constants';

const userSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' }, /** from user-Collection **/
  role: { type: String, required: true, enum: roles },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

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
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  users: { type: [userSchema] },
  isActive: { type: Boolean, default: true },
  subscription: { type: SubscriptionSchema, required: true, default: defaultPlan },
}, {
  timestamps: true,
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

export interface UserInCompanyInterface {
  _id?: string;
  user: mongoose.Schema.OjectId;
  role: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyInterface {
  _id?: string;
  name: string;
  creator?: string;
  users?: UserInCompanyInterface[];
  subscription: SubscriptionInterface;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
