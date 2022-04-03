/** @format */

import { IsNotEmpty, IsNumber, IsPositive, MaxLength, MinLength } from 'class-validator';
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
    default: 'Mauris eget erat malesuada'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiHideProperty()
  deletedAt: Date;
}
