/** @format */

import { IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostUpdateDto {
  @ApiPropertyOptional({
    description: 'Name',
    minLength: 4,
    maxLength: 36,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(36)
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description',
    minLength: 4,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Markdown',
    minLength: 24,
    maxLength: 7200,
    default: 'In hac habitasse platea dictumst. Aenean et aliquam arcu'
  })
  @IsOptional()
  @MinLength(24)
  @MaxLength(7200)
  @IsString()
  markdown?: string;

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
