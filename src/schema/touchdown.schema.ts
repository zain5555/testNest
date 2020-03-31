import * as mongoose from 'mongoose';

export const TouchdownSchema = new mongoose.Schema({
  primaryMetric: { type: String, required: true },
  
}, {
  timestamps: true,
  autoCreate: true,
});


export interface TouchdownInterface {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
