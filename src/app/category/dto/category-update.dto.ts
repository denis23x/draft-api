/** @format */

import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiPropertyOptional({
    default: 'category'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  name?: string;
}
