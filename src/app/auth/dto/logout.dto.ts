/** @format */

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class LogoutDto {
  @ApiProperty({
    description: 'Client unique identifier',
    default: 'sPx5uhkrzLbrJNvtEbKl'
  })
  @IsNotEmpty()
  @IsString()
  fingerprint: string;

  @ApiHideProperty()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  reset?: number;
}
