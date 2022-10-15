/** @format */

import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FileDto {
  @ApiProperty({
    description: 'Field name'
  })
  @IsNotEmpty()
  @IsString()
  fieldname: string;

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
    description: 'Destination'
  })
  @IsNotEmpty()
  @IsString()
  destination: string;

  @ApiProperty({
    description: 'File name'
  })
  @IsNotEmpty()
  @IsString()
  filename: string;

  @ApiProperty({
    description: 'Path'
  })
  @IsNotEmpty()
  @IsString()
  path: string;

  @ApiProperty({
    description: 'Size',
    default: 1
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  size: number;
}
