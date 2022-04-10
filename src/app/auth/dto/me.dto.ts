/** @format */

import { IsIn, IsOptional } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts', 'sessions', 'settings'], {
    each: true
  })
  scope?: string[];
}
