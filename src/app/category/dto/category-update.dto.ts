/** @format */

import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryUpdateDto {
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
    maxLength: 255
  })
  @IsOptional()
  @MaxLength(255)
  @IsString()
  description?: string | null;
}
