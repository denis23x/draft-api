/** @format */

import { IsIn, IsOptional } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class MeDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  scope?: string[];
}
