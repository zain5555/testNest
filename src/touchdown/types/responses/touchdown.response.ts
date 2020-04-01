import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { goalsStatus } from '../../../common/constants';
import { Conflict, NotFound, UnprocessableEntityResponse } from '../../../common/responses';
import { ErrorMessages } from '../../../common/errors';
import { GoalsInterface } from '../../../schema/touchdown.schema';

export class GoalsResponse {
  @ApiProperty({
    example: '5e8476ae94f37b48b224d73b',
  })
  _id: string;
  
  @ApiProperty({
    example: 'Do this',
  })
  goal: string;
  
  @ApiProperty({
    example: 'InProgress',
    enum: goalsStatus,
  })
  status: string;
}

export class GetLastTouchdownResponse {
  @ApiProperty({
    example: '5e8476ae94f37b48b224d73a',
  })
  _id: string;
  
  @ApiProperty({
    type: GoalsResponse,
    isArray: true,
  })
  goals: GoalsResponse[];
  
  @ApiProperty({
    example: '2020-04-01T11:10:38.104Z',
  })
  createdAt?: string;
  
  @ApiProperty({
    example: '2020-03-31T00:00:00.000Z',
  })
  startDate?: string;
}

export class TouchdownNotFoundResponse extends NotFound {
  @ApiProperty({ example: ErrorMessages.TOUCHDOWN_NOT_FOUND })
  message: string;
}

export class TouchdownInsertionUPResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.TOUCHDOWN_INSERTION_NOT_ALLOWED })
  message: string;
}

export class AddFeedbackUPResponse extends UnprocessableEntityResponse {
  @ApiProperty({ example: ErrorMessages.CANNOT_LEAVE_COMMENT_ON_YOUR_OWN_TOUCHDOWN })
  message: string;
}

export class AddFeedbackConflictResponse extends Conflict {
  @ApiProperty({ example: ErrorMessages.CANNOT_UPDATE_COMMENT })
  message: string;
}

class RatingAndCommentResponse {
  @ApiProperty({
    example: 20,
  })
  rate: number;
  @ApiProperty({
    example: 'comment text',
  })
  comment: string;
  
  @ApiProperty({
    example: '2020-04-01T11:10:38.104Z',
  })
  createdAt: string;
}

export class CreatorResponse {
  @ApiProperty({
    example: '5e8476ae94f37b48b224d73a',
  })
  _id: string;
  
  @ApiProperty({
    example: 'Afzaal Ahmad',
  })
  fullName: string;
}

export class GetOneTouchdownResponse {
  @ApiProperty({
    example: '5e8476ae94f37b48b224d73a',
  })
  _id: string;
  
  @ApiProperty({
    example: 'primary metric',
  })
  primaryMetric: string;
  
  @ApiProperty({
    example: 'description',
  })
  description: string;
  
  @ApiProperty({
    example: true,
  })
  isActive: boolean;
  
  @ApiProperty({
    type: GoalsResponse,
    isArray: true,
  })
  goals: GoalsResponse[];
  
  @ApiProperty({
    type: GoalsResponse,
    isArray: true,
  })
  previousGoals: GoalsResponse[];
  
  @ApiProperty({
    example: '2020-03-31T00:00:00.000Z',
  })
  startDate: string;
  
  @ApiProperty({
    type: RatingAndCommentResponse,
    isArray: true,
  })
  ratingsAndComments: RatingAndCommentResponse[];
  
  @ApiPropertyOptional({
    example: 8,
  })
  averageRating?: number;
  
  @ApiProperty({
    type: CreatorResponse,
  })
  createdBy: CreatorResponse;
  
  @ApiProperty({
    example: '2020-04-01T11:10:38.104Z',
  })
  createdAt: string;
}

export class GetAllDataResponse {
  @ApiProperty({
    example: '5e8476ae94f37b48b224d73a',
  })
  _id: string;
  
  @ApiProperty({
    example: 'primary metric',
  })
  primaryMetric: string;
  
  @ApiPropertyOptional({
    example: 8,
  })
  rate: number;
  
  @ApiProperty({
    example: '2020-03-31T00:00:00.000Z',
  })
  startDate: string;
  
  @ApiProperty({
    example: '2020-04-01T11:10:38.104Z',
  })
  createdAt: string;
}

export class GetAllPaginatedResponse {
  @ApiProperty({
    type: GetAllDataResponse,
    isArray: true,
  })
  data: GetAllDataResponse[];
  
  @ApiProperty({
    example: '2020-04-01T11:10:38.104Z',
  })
  cursor: string;
  
  @ApiProperty({
    example: true,
  })
  hasMore: boolean;
}
