/** @format */

import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileCreateDto {
  @ApiProperty({
    description: 'Avatar'
  })
  @IsOptional()
  @IsArray()
  avatar?: Express.Multer.File[];

  @ApiProperty({
    description: 'Image'
  })
  @IsOptional()
  @IsArray()
  image?: Express.Multer.File[];
}
