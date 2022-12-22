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

export class RegistrationDto {
  @ApiProperty({
    description: 'Name',
    minLength: 4,
    maxLength: 24,
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
    return !registrationDto.googleId && !registrationDto.facebookId && !registrationDto.githubId;
  })
  @MinLength(6)
  @MaxLength(32)
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
}
