/** @format */

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiProperty({
    default: 'moderator'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  name?: string;

  @ApiProperty({
    default: null
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  biography?: string;

  @ApiProperty({
    default: 'moder@moder.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
