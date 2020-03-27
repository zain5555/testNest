import * as mongoose from 'mongoose';

export const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  company: { type: mongoose.Schema.ObjectId, required: true, ref: 'Company' }, /** from company-Collection **/
  invitedBy: { type: mongoose.Schema.ObjectId, required: true, ref: 'User' },
  isActive: { type: Boolean, required: true, default: true },
  isAccepted: { type: Boolean, required: true, default: false },
}, {
  timestamps: true,
  autoCreate: true,
});

export interface InvitationInterface {
  _id?: string;
  email?: string;
  isActive?: boolean;
  isAccepted?: boolean;
  company?: mongoose.Schema.ObjectId;
  invitedBy?: mongoose.Schema.ObjectId;
  updatedAt?: string;
  createdAt?: string;
}
