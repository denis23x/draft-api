/** @format */

import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LogoutDto {
  @ApiProperty({
    description: 'Client unique identifier',
    default: 'swagger'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  reset?: number;
}
