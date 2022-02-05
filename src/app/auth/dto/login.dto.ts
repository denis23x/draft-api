/** @format */

import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
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
    return !loginDto.googleId && !loginDto.facebookId;
  })
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumberString()
  googleId?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumberString()
  facebookId?: string;
}
