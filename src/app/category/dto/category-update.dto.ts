/** @format */

import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiProperty({
    default: 'category'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  name?: string;
}
