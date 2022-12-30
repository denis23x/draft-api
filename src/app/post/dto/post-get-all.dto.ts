/** @format */

import { IsIn, IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostGetAllDto {
  @ApiPropertyOptional({
    description: 'Name',
    minLength: 4,
    maxLength: 36
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(36)
  name?: string;

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
  @IsIn(['category', 'user'], {
    each: true
  })
  scope?: string[];
}
