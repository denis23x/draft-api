/** @format */

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
    return !loginDto.googleId && !loginDto.facebookId && !loginDto.githubId;
  })
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  facebookId?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  githubId?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({
    description: 'Client unique identifier',
    default: 'swagger'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;
}
