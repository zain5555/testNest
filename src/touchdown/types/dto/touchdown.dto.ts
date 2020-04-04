import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { CompanyIdDto } from '../../../common/dto';
import { Type } from 'class-transformer';
import { goalsStatus, listSortingOrders, touchdownSortByOptions } from '../../../common/constants';

export class TouchdownIdDto {
  @ApiProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  touchdownId: string;
}

export class GetAllPaginatedDto extends CompanyIdDto {
  @ApiPropertyOptional({ description: 'cursor', example: '2020-02-11T08:33:05.147Z' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly cursor: string;
  
  @ApiPropertyOptional({ description: 'limit', example: '20' })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(50)
  readonly limit: number;
  
  @ApiPropertyOptional({
    example: 'createdAt',
    enum: touchdownSortByOptions
  })
  @IsOptional()
  @IsString()
  @IsIn(touchdownSortByOptions)
  sortBy: string;
  
  @ApiPropertyOptional({
    example: 'ascending',
    enum: listSortingOrders
  })
  @IsOptional()
  @IsString()
  @IsIn(listSortingOrders)
  order: string;
  
  @ApiPropertyOptional({
    example: 'search'
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search: string;
}

export class PreviousGoalsDto {
  @ApiProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  _id: string;
  
  @ApiProperty({
    example: 'InProgress',
    enum: goalsStatus,
  })
  @IsString()
  @IsIn(goalsStatus)
  status: string;
}

export class AddTouchdownDto extends CompanyIdDto {
  @ApiProperty({
    example: '7 New Leads',
  })
  @IsString()
  @IsNotEmpty()
  primaryMetric: string;
  
  @ApiProperty({
    example: ['Reach 5 goals', 'Reach 7 goals'],
  })
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  goals: string[];
  
  @ApiProperty({
    type: PreviousGoalsDto,
    isArray: true,
  })
  @IsOptional()
  @ValidateNested({
    each: true,
  }) @Type(() => PreviousGoalsDto)
  previousGoals: PreviousGoalsDto[];
  
  @ApiProperty({ example: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;
  
  @ApiProperty({ example: '2020-03-31' })
  @Type(() => Date)
  @IsDate()
  startDate: string;
}

export class UpdateGoalDto {
  @ApiProperty({
    example: '5dc097377f526269d44ccf2e',
  })
  @IsMongoId()
  _id: string;
  
  @ApiProperty({
    example: 'InProgress',
    enum: goalsStatus,
  })
  @IsString()
  @IsIn(goalsStatus)
  status: string;
}

export class AddCommentAndRatingDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @Min(1)
  @Max(10)
  rate: number;
  
  @ApiProperty({ example: 'this is my comment' })
  @IsString()
  @IsNotEmpty()
  comment: string;
}
