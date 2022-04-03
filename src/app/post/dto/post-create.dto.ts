/** @format */

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostCreateDto {
  @ApiProperty({
    description: 'Title',
    default: 'Fusce tempor semper semper'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  title: string;

  @ApiProperty({
    description: 'Body',
    default: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
  })
  @IsNotEmpty()
  @MinLength(24)
  @MaxLength(7200)
  body: string;

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
