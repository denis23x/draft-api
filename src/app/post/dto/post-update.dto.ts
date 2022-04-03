/** @format */

import { IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostUpdateDto {
  @ApiPropertyOptional({
    description: 'Title',
    default: 'Fusce tempor semper semper'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(36)
  title?: string;

  @ApiPropertyOptional({
    description: 'Body',
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
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
