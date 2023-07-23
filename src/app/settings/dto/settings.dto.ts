/** @format */

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SettingsDto {
  @ApiProperty({
    default: 1
  })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  id: number;

  @ApiPropertyOptional({
    description: 'Theme',
    default: 'light'
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({
    description: 'Theme Prism',
    default: 'default'
  })
  @IsOptional()
  @IsString()
  themePrism?: string;

  @ApiPropertyOptional({
    description: 'Theme Background',
    default: 'slanted-gradient'
  })
  @IsOptional()
  @IsString()
  themeBackground?: string;

  @ApiPropertyOptional({
    description: 'Language',
    default: 'en-US'
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Buttons',
    default: 'left'
  })
  @IsOptional()
  @IsString()
  buttons?: string;

  @ApiPropertyOptional({
    description: 'Monospace',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  monospace?: boolean;

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
