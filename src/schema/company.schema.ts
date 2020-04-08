import * as mongoose from 'mongoose';
import { roles, RolesEnum } from '../common/constants';



const SubUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' }, /** from user-Collection **/
  isActive: { type: Boolean, default: true },
  role: { type: String, required: true, enum: roles, default: RolesEnum.BROKER },
}, {
  timestamps: true,
});

export const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  creator: { type: mongoose.Schema.ObjectId, ref: 'User' },
  users: { type: [SubUserSchema] },
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



export interface CompanyInterface {
  _id?: string;
  name: string;
  creator?: string;
  users?: SubUserInterface[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
