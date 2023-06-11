/** @format */

import {
  Equals,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UserCreateDto {
  @ApiProperty({
    description: 'Name',
    minLength: 4,
    maxLength: 24,
    default: 'moderator'
  })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  @IsString()
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
  @ValidateIf((userCreateDto: UserCreateDto) => {
    return !userCreateDto.googleId && !userCreateDto.facebookId && !userCreateDto.githubId;
  })
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password?: string;

  @ApiProperty({
    description: 'Terms of use',
    default: true
  })
  @IsNotEmpty()
  @Equals(true)
  @IsBoolean()
  @Type(() => Boolean)
  terms: boolean;

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
