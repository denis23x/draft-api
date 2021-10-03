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

export class FindAllPostsDto {
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
}

export class FindOnePostDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}
