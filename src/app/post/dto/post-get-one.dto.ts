/** @format */

import { IsIn, IsOptional } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class PostGetOneDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['category', 'user'], {
    each: true
  })
  readonly scope?: string[];
}
