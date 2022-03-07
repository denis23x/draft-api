/** @format */

import { IsIn, IsOptional } from 'class-validator';
import { ApiHideProperty } from '@nestjs/swagger';

export class GetOneDto {
  @ApiHideProperty()
  @IsOptional()
  @IsIn(['user', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}
