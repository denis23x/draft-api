/** @format */

import { IsIn, IsOptional } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class CategoryGetOneDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['user', 'posts'], {
    each: true
  })
  scope?: string[];
}
