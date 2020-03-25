import * as mongoose from 'mongoose';

export const InvitationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, required: false },
  email: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  company: { type: mongoose.Schema.ObjectId, required: true, ref: 'Company' }, /** from company-Collection **/
  invitedBy: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  isActive: { type: Boolean, required: true, default: true },
  isAccepted: { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
});

export interface InvitationInterface {
  _id?: mongoose.Schema.ObjectId;
  user?: mongoose.Schema.ObjectId;
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isAccepted?: boolean;
  company?: mongoose.Schema.ObjectId;
  invitedBy?: mongoose.Schema.ObjectId;
  updatedAt?: string;
  createdAt?: string;
}
