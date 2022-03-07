/** @format */

import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDto {
  @ApiProperty({
    default: 'category'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;
}
