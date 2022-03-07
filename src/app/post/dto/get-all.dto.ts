/** @format */

import { IsIn, IsNumber, IsOptional, IsPositive, MaxLength, MinLength } from 'class-validator';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetAllDto {
  @ApiPropertyOptional({
    description: 'Title'
  })
  @IsOptional()
  @MinLength(4)
  @MaxLength(24)
  readonly title?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly exact?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly userId?: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  readonly categoryId?: number;

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
