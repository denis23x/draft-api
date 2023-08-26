/** @format */

import { IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FeedbackDto {
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
    minLength: 4,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  description: string;

  @ApiHideProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userId: number;

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
