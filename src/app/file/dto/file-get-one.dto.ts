/** @format */

import { IsNotEmpty, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FileGetOneDto {
  @ApiProperty({
    description: 'Url',
    default: 'https://via.placeholder.com/400x200.png?text=Placeholder'
  })
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
