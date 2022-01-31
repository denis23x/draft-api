/** @format */

import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  readonly name: string;
}

export class GetAllCategoryDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly exact?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly userId?: number;

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
  @IsIn(['user', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}

export class GetOneCategoryDto {
  @IsOptional()
  @IsIn(['user', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}

export class UpdateCategoryDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;
}
