/** @format */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateDto {
  @ApiProperty({
    default: 'moderator'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @ApiProperty({
    default: null
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly biography?: string;

  @ApiProperty({
    default: 'moder@moder.com'
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
