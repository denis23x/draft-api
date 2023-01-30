/** @format */

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
  @ApiPropertyOptional({
    description: 'Name',
    minLength: 4,
    maxLength: 24,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
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
}
