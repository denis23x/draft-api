/** @format */

import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength,
  ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((createUserDto: CreateUserDto) => {
    return !createUserDto.googleId && !createUserDto.facebookId;
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

export class GetAllUserDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly exact?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly page?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly size?: number;

  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}

export class GetOneUserDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly biography?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;
}
