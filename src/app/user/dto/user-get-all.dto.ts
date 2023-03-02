/** @format */

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserGetAllDto {
  @ApiPropertyOptional({
    description: 'Name',
    minLength: 4,
    maxLength: 16
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(16)
  @IsString()
  name?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  exact?: number;

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
  @IsIn(['categories', 'posts'], {
    each: true
  })
  scope?: string[];
}
