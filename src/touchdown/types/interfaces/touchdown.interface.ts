import { GoalsInterface, RatingAndCommentInterface, TouchdownInterface } from '../../../schema/touchdown.schema';

interface RatingAndCommentResponseInterface {
  rate: number;
  comment: string;
  createdAt: string;
}

export interface PopulatedTouchdownInterface {
  _id: string;
  primaryMetric: string;
  goals: GoalsInterface[];
  description: string;
  previousTouchdown: TouchdownInterface;
  startDate: string;
  ratingsAndComments: RatingAndCommentInterface[];
  averageRating: number;
  company: string;
  createdBy: {
    fullName: string;
    _id: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetOneTouchdownResponseInterface {
  _id?: string;
  primaryMetric: string;
  description: string;
  isActive: boolean;
  goals: GoalsInterface[];
  previousGoals: GoalsInterface[];
  startDate: string;
  ratingsAndComments: RatingAndCommentResponseInterface[];
  averageRating?: number;
  createdBy: {
    _id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface GetAllPaginatedQueryInterface {
  companyId: string;
  cursor?: string;
  limit?: number;
  sortBy?: string;
  order?: string;
  search?: string;
}

export interface GetAllDataInterface {
  _id: string;
  primaryMetric: string;
  rate: number;
  startDate: string;
  createdAt: string;
}

export interface GetAllPaginatedResponseInterface {
  data: GetAllDataInterface[];
  cursor: string;
  hasMore: boolean;
}

export interface GetLastResponseInterface {
  _id?: string;
  goals?: GoalsInterface[];
  createdAt?: string;
  startDate?: string;
}

export interface UpdateGoalsInterface {
  _id: string;
  status: string;
}

export interface AddTouchDownInterface {
  companyId: string;
  primaryMetric: string;
  description: string;
  goals: string[];
  previousGoals: Array<UpdateGoalsInterface>;
  startDate: string;
}

export interface AddCommentAndRatingInterface {
  rate: number;
  comment: string;
}
