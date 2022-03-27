/** @format */

import { ApiHideProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional } from 'class-validator';

export class UserGetOneDto {
  @ApiHideProperty()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiHideProperty()
  @IsOptional()
  @IsIn(['categories', 'posts'], {
    each: true
  })
  readonly scope?: string[];
}
