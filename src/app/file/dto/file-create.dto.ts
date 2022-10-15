/** @format */

import { IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileCreateDto {
  @ApiProperty({
    description: 'Avatars'
  })
  @IsOptional()
  @IsArray()
  avatars?: Express.Multer.File[];

  @ApiProperty({
    description: 'Images'
  })
  @IsOptional()
  @IsArray()
  images?: Express.Multer.File[];
}
