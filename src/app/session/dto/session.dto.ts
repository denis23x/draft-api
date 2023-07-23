/** @format */

import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SessionDto {
  @ApiProperty({
    default: 1
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional({
    description: 'User agent'
  })
  @IsOptional()
  @IsString()
  ua?: string;

  @ApiPropertyOptional({
    description: 'Browser fingerprint'
  })
  @IsOptional()
  @IsString()
  fingerprint?: string;

  @ApiPropertyOptional({
    description: 'Refresh token'
  })
  @IsOptional()
  @IsString()
  refresh?: string;

  @ApiPropertyOptional({
    description: 'Refresh token expires'
  })
  @IsOptional()
  @IsString()
  expires?: string;

  @ApiPropertyOptional({
    description: 'User IP'
  })
  @IsOptional()
  @IsString()
  ip?: string;

  @ApiHideProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @IsString()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  updatedAt: Date;

  @ApiHideProperty()
  @IsString()
  deletedAt: Date;
}
