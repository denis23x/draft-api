/** @format */

import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserDto {
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
    maxLength: 24,
    default: 'moderator'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @ApiPropertyOptional({
    default: null,
    minLength: 4,
    maxLength: 255
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(255)
  description?: string | null;

  @ApiPropertyOptional({
    default: null
  })
  @IsOptional()
  avatar?: string | null;

  @ApiProperty({
    default: 'moder@moder.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiHideProperty()
  deletedAt: Date;
}
