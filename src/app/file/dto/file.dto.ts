/** @format */

import { IsNotEmpty, IsNumber, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FileDto {
  @ApiProperty({
    default: 1
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @ApiHideProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userId: number;

  @ApiProperty({
    description: 'Path'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  path: string;

  @ApiProperty({
    description: 'Original filename'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  originalName: string;

  @ApiProperty({
    description: 'Filename'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  fileName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
