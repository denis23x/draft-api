/** @format */

import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
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
