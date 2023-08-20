/** @format */

import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostGetAllDto {
  @ApiPropertyOptional({
    description: 'Full text search',
    minLength: 4,
    maxLength: 16
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(16)
  @IsString()
  query?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userId?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    description: 'Page',
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Size',
    default: 10
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  size?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(['newest', 'oldest'], {
    each: true
  })
  orderBy?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(['category', 'user'], {
    each: true
  })
  scope?: string[];
}
