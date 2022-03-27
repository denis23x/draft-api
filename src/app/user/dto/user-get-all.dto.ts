/** @format */

import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
  MinLength
} from 'class-validator';
import { Type } from 'class-transformer';

export class UserGetAllDto {
  @ApiPropertyOptional({
    description: 'Name'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly exact?: number;

  @ApiPropertyOptional({
    description: 'Page',
    default: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({
    description: 'Size',
    default: 10
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly size?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}
