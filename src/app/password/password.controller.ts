/** @format */

import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { PasswordService } from './password.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordCheckGetDto, PasswordResetGetDto, PasswordResetUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get check'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('check')
  @UseGuards(AuthGuard('access'))
  async getCheck(@Req() request: Request, @Query() passwordCheckGetDto: PasswordCheckGetDto): Promise<boolean> {
    return this.passwordService.getCheck(request, passwordCheckGetDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get reset'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Get('reset')
  async getReset(@Req() request: Request, @Query() passwordResetGetDto: PasswordResetGetDto): Promise<Partial<User>> {
    return this.passwordService.getReset(request, passwordResetGetDto);
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
  async postReset(@Req() request: Request, @Body() passwordResetUpdateDto: PasswordResetUpdateDto): Promise<Partial<User>> {
    return this.passwordService.postReset(request, passwordResetUpdateDto);
  }
}
