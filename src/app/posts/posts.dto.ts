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

export class CreateDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  readonly title: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(6400)
  readonly body: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly image?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly categoryId: number;
}

export class GetAllDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly title?: string;

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
  @IsIn(['user', 'category'], {
    each: true
  })
  readonly scope?: string[];
}

export class GetOneDto {
  @IsOptional()
  @IsIn(['user', 'category'], {
    each: true
  })
  readonly scope?: string[];
}

export class UpdateDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly title?: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(6400)
  readonly body?: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly image?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly categoryId?: number;
}
