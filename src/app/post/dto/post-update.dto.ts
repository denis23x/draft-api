/** @format */

import { IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostUpdateDto {
  @ApiPropertyOptional({
    default: 'title'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(36)
  title?: string;

  @ApiPropertyOptional({
    default: 'body'
  })
  @IsOptional()
  @MinLength(24)
  @MaxLength(7200)
  body?: string;

  @ApiPropertyOptional({
    default: null
  })
  @IsOptional()
  image?: string | null;

  @ApiPropertyOptional({
    description: 'Category Id',
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId?: number;
}
