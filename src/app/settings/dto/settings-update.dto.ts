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
    description: 'Window caption buttons position',
    default: 'left'
  })
  @IsOptional()
  @IsString()
  windowButtonPosition?: string;

  @ApiPropertyOptional({
    description: 'Markdown monospace',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  markdownMonospace?: boolean;

  @ApiPropertyOptional({
    description: 'Scroll to top',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageScrollToTop?: boolean;

  @ApiPropertyOptional({
    description: 'Infinite scroll',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageScrollInfinite?: boolean;

  @ApiPropertyOptional({
    description: 'Redirect home page',
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  pageRedirectHome?: boolean;
}
