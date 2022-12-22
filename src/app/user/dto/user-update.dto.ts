/** @format */

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UserUpdateDto {
  @ApiPropertyOptional({
    description: 'Name',
    minLength: 4,
    maxLength: 24,
    default: 'moderator'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  name?: string;

  @ApiPropertyOptional({
    default: null,
    minLength: 4,
    maxLength: 255
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

  @ApiHideProperty()
  @IsOptional()
  settings?: any;
}
