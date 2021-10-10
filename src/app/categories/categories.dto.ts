/** @format */

import {
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

export class FindAllDto {
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
}

export class FindOneDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}
