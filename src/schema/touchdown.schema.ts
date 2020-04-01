import * as mongoose from 'mongoose';
import { goalsStatus, GoalStatus } from '../common/constants';

export const GoalsSchema = {
  status: { type: String, default: GoalStatus.IN_COMPLETE, enum: goalsStatus },
  goal: { type: String, required: true },
};

export const RatingAndCommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true },
  rate: { type: Number, required: true, min: 1, max: 10 },
}, {
  timestamps: true,
});

export const TouchdownSchema = new mongoose.Schema({
  primaryMetric: { type: String },
  goals: { type: [GoalsSchema] },
  description: { type: String, required: true },
  previousTouchdown: { type: mongoose.Schema.ObjectId, ref: 'Touchdown'},
  ratingsAndComments: { type: [RatingAndCommentSchema] },
  averageRating: { type: Number, default: 0, min: 0, max: 10 },
  startDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  company: { type: mongoose.Schema.ObjectId, ref: 'Company', required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
  autoCreate: true,
});

export interface GoalsInterface {
  status?: string;
  goal: string;
  _id?: string;
}

export interface RatingAndCommentInterface {
  _id?: string;
  user: string;
  comment: string;
  rate: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TouchdownInterface {
  _id?: string;
  primaryMetric: string;
  goals: GoalsInterface[];
  description: string;
  averageRating?: number;
  previousTouchdown?: string;
  isActive?: boolean;
  startDate: string;
  ratingsAndComments?: RatingAndCommentInterface[];
  company: string;
  createdBy: string;
  createdAt?: string;
  updatedAt?: string;
}
