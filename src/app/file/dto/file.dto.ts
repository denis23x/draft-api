/** @format */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
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
    description: 'Path'
  })
  @IsNotEmpty()
  @IsString()
  path: string;
}
