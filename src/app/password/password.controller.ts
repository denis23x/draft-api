/** @format */

import { Body, Controller, Get, Put, Query, Req, UseGuards } from '@nestjs/common';
import { PasswordService } from './password.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PasswordCheckGetDto, PasswordResetGetDto, PasswordResetUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '../../database/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Password')
@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get passport validation'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('check')
  @UseGuards(AuthGuard('access'))
  async checkGet(@Req() request: Request, @Query() passwordCheckGetDto: PasswordCheckGetDto): Promise<any> {
    return this.passwordService.checkGet(request, passwordCheckGetDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get request to reset password'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Get('reset')
  async resetGet(@Req() request: Request, @Query() passwordResetGetDto: PasswordResetGetDto): Promise<Partial<User>> {
    return this.passwordService.resetGet(request, passwordResetGetDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update password'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Put('reset')
  async resetUpdate(@Req() request: Request, @Body() passwordResetUpdateDto: PasswordResetUpdateDto): Promise<Partial<User>> {
    return this.passwordService.resetUpdate(request, passwordResetUpdateDto);
  }
}
