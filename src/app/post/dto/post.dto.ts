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
    default: 'title'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  title: string;

  @ApiProperty({
    default: 'body'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  body: string;

  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  image?: string;

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
