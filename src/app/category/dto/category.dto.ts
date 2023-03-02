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
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryDto {
  @ApiProperty({
    default: 1
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

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
    maxLength: 255
  })
  @IsOptional()
  @MaxLength(255)
  description?: string | null;

  @ApiProperty()
  @IsString()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  updatedAt: Date;

  @ApiHideProperty()
  @IsString()
  deletedAt: Date;
}
