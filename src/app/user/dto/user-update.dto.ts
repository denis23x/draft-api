/** @format */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional({
    description: 'Name',
    default: 'moderator'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  name?: string;

  @ApiPropertyOptional({
    default: null
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(255)
  biography?: string | null;

  @ApiPropertyOptional({
    default: null
  })
  @IsOptional()
  avatar?: string | null;

  @ApiPropertyOptional({
    default: 'moder@moder.com'
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
