/** @format */

import { ApiHideProperty } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class UserGetOneDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  scope?: string[];
}
