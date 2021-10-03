/** @format */

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
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

export class FindAllUsersDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

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
}

export class FindOneUserDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}

export class DeleteUserDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly id: number;
}
