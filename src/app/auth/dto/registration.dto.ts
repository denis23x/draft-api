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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrationDto {
  @ApiProperty({
    description: 'Name',
    default: 'moderator'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

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
  @ValidateIf((registrationDto: RegistrationDto) => {
    return !registrationDto.googleId && !registrationDto.facebookId;
  })
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @ApiPropertyOptional({
    description: 'Google identification',
    default: null
  })
  @IsOptional()
  @IsNumberString()
  googleId?: string;

  @ApiPropertyOptional({
    description: 'Facebook identification',
    default: null
  })
  @IsOptional()
  @IsNumberString()
  facebookId?: string;
}
