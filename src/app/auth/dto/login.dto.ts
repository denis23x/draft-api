/** @format */

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    default: 'moder@moder.com'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Password',
    minLength: 6,
    maxLength: 32,
    default: 'moder@moder.com'
  })
  @ValidateIf((loginDto: LoginDto) => {
    return !loginDto.googleId && !loginDto.facebookId;
  })
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  googleId?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  facebookId?: string;

  @ApiProperty({
    description: 'Client unique identifier',
    default: 'sPx5uhkrzLbrJNvtEbKl'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  scope?: string[];
}
