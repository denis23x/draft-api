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

export class CreateDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(24)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ValidateIf((createDto: CreateDto) => {
    return !createDto.googleId && !createDto.facebookId;
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

export class GetAllDto {
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

export class GetOneDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}

export class UpdateDto {
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
