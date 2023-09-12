/** @format */

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FileDto {
  @ApiProperty({
    description: 'Original name'
  })
  @IsNotEmpty()
  @IsString()
  originalname: string;

  @ApiProperty({
    description: 'Encoding'
  })
  @IsNotEmpty()
  @IsString()
  encoding: string;

  @ApiProperty({
    description: 'Mime type'
  })
  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @ApiProperty({
    description: 'File name'
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Size',
    default: 1024
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  size: number;
}
