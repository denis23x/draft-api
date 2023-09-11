/** @format */

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileGetOneDto {
  @ApiProperty({
    description: 'Filename',
    default: 'aa6868ab-90e4-4ce6-859b-cf7397f5bc85.png'
  })
  @IsNotEmpty()
  @IsString()
  filename: string;
}
