/** @format */

import { IsNotEmpty, IsNumber, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDto {
  @ApiProperty({
    description: 'Title',
    default: 'title'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  title: string;

  @ApiProperty({
    description: 'Body',
    default: 'body'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  body: string;

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
