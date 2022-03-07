/** @format */

import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDto {
  @ApiProperty({
    description: 'Name',
    default: 'category'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;
}
