/** @format */

import { IsIn, IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CategoryGetAllDto {
  @ApiPropertyOptional({
    description: 'Name'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly name?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly userId?: number;

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
  @IsIn(['user', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}
