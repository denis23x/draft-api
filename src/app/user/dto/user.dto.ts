/** @format */

import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
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
    default: 'moderator'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @ApiProperty({
    default: null
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  biography: string | null;

  @ApiProperty({
    default: null
  })
  @IsOptional()
  avatar: string | null;

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
