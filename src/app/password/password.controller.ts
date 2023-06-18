/** @format */

import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { PasswordService } from './password.service';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordGetOneDto, PasswordUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';

@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get reset'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Get('reset')
  async getReset(@Req() request: Request, @Query() passwordGetOneDto: PasswordGetOneDto): Promise<User> {
    return this.passwordService.getReset(request, passwordGetOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Post reset'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Post('reset')
  async postReset(@Req() request: Request, @Body() passwordUpdateDto: PasswordUpdateDto): Promise<User> {
    return this.passwordService.postReset(request, passwordUpdateDto);
  }
}
