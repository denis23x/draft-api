/** @format */

import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetAllDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly title?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly userId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly categoryId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly size?: number;

  @IsOptional()
  @IsArray()
  @IsIn(['user', 'category'], {
    each: true
  })
  readonly scope: string[];
}

export class GetOneDto {
  @IsOptional()
  @IsArray()
  @IsIn(['user', 'category'], {
    each: true
  })
  readonly scope: string[];
}
