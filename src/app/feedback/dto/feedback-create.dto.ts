/** @format */

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FeedbackCreateDto {
  @ApiProperty({
    description: 'Name',
    minLength: 4,
    maxLength: 36,
    default: 'Lorem ipsum dolor sit amet'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(36)
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description',
    minLength: 4,
    maxLength: 255,
    default: 'Mauris venenatis ante quis diam iaculis sollicitudin'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(255)
  @IsString()
  description: string;
}
