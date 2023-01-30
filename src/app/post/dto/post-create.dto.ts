/** @format */

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostCreateDto {
  @ApiProperty({
    description: 'Name',
    minLength: 4,
    maxLength: 36,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description',
    minLength: 4,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Markdown',
    minLength: 24,
    maxLength: 7200,
    default: 'In hac habitasse platea dictumst. Aenean et aliquam arcu'
  })
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(7200)
  @IsString()
  markdown: string;

  @ApiPropertyOptional({
    default: null
  })
  @IsOptional()
  image?: string | null;

  @ApiProperty({
    description: 'Category Id',
    default: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;
}
