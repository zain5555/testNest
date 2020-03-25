import * as mongoose from 'mongoose';
import { roles } from '../common/constants';

const userSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' }, /** from user-Collection **/
  role: { type: String, required: true, enum: roles },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  users: { type: [userSchema] },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

export interface UserInCompanyInterface {
  _id?: string;
  user: mongoose.Schema.OjectId;
  role: string;
  isActive: boolean;
}

export interface CompanyInterface {
  _id?: string;
  name: string;
  creator?: string;
  users?: UserInCompanyInterface[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
