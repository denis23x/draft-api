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

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((loginDto: LoginDto) => {
    return !loginDto.googleId && !loginDto.facebookId;
  })
  @MinLength(6)
  @MaxLength(32)
  password?: string;

  @IsOptional()
  @IsNumberString()
  googleId?: string;

  @IsOptional()
  @IsNumberString()
  facebookId?: string;
}
