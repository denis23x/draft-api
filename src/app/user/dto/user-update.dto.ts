/** @format */

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Description',
    maxLength: 255
  })
  @IsOptional()
  @MaxLength(255)
  description?: string | null;

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

  @ApiPropertyOptional({
    description: 'Password',
    minLength: 6,
    maxLength: 32
  })
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;

  @ApiPropertyOptional({
    default: 'moder2@moder.com'
  })
  @IsOptional()
  @IsEmail()
  newEmail?: string;

  @ApiPropertyOptional({
    description: 'Password',
    minLength: 6,
    maxLength: 32
  })
  @IsOptional()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  newPassword?: string;

  @ApiHideProperty()
  @IsOptional()
  settings?: any;
}
