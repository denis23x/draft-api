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
  readonly name: string;

  @IsOptional()
  readonly isPrivate?: string;
}

export class GetAllDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

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
  readonly scope: string[];
}

export class GetOneDto {
  @IsOptional()
  @IsIn(['user', 'posts'], {
    each: true
  })
  readonly scope: string[];
}

export class UpdateDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @IsOptional()
  readonly isPrivate?: string;
}
