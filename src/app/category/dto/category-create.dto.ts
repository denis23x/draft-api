/** @format */

import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryCreateDto {
  @ApiProperty({
    description: 'Name',
    minLength: 4,
    maxLength: 24,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @ApiProperty({
    description: 'Description',
    minLength: 6,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  description: string;
}
