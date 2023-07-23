/** @format */

import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SettingsUpdateDto {
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
}
