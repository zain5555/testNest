import * as mongoose from 'mongoose';
import { roles, RolesEnum } from '../common/constants';

const SubCompanySchema = new mongoose.Schema({
  company: { type: mongoose.Schema.ObjectId, required: true, ref: 'Company' }, /** from user-Collection **/
  creator: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: roles, required: true, default: RolesEnum.BROKER },
}, {
  timestamps: true,
});

export const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    avatar: { type: String, default: '' },
    email: { type: String, index: { unique: true }, required: true },
    password: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    companies: { type: [SubCompanySchema] },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

export interface SubCompanyInterface {
  _id?: string;
  company?: string;
  isActive?: boolean;
  creator?: boolean;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserInterface {
  _id?: string;
  fullName?: string;
  avatar?: string;
  email?: string;
  password?: string;
  isActive?: boolean;
  isEmailVerified?: boolean;
  companies?: SubCompanyInterface[];
  createdAt?: string;
  updatedAt?: string;
}
