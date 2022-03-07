/** @format */

import { IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateDto {
  @ApiProperty({
    default: 'title'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  title?: string;

  @ApiProperty({
    default: 'body'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  body?: string;

  @ApiProperty({
    default: null
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  image?: string;

  @ApiProperty({
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  categoryId?: string;
}
