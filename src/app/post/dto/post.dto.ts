/** @format */

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PostDto {
  @ApiProperty({
    default: 1
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @ApiProperty({
    description: 'Title',
    minLength: 4,
    maxLength: 36,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  title: string;

  @ApiProperty({
    description: 'Description',
    minLength: 4,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  description: string;

  @ApiProperty({
    description: 'Body',
    minLength: 24,
    maxLength: 7200,
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

  @ApiHideProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userId: number;

  @ApiHideProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiHideProperty()
  deletedAt: Date;
}
