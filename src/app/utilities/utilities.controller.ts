/** @format */

import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationDto, PasswordResetDto, PasswordSetDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { UserRelationGuard } from '../auth/guards';

@ApiTags('Utilities')
@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get email confirmation'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('email/confirmation/:id')
  @UseGuards(AuthGuard('access'), UserRelationGuard)
  async getEmailConfirmation(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.utilitiesService.getEmailConfirmation(request, id);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Post email confirmation'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Post('email/confirmation')
  async postEmailConfirmation(@Req() request: Request, @Query() emailConfirmationDto: EmailConfirmationDto): Promise<User> {
    return this.utilitiesService.postEmailConfirmation(request, emailConfirmationDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get password reset'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Get('password/reset')
  async getPasswordReset(@Req() request: Request, @Query() passwordResetDto: PasswordResetDto): Promise<User> {
    return this.utilitiesService.getPasswordReset(request, passwordResetDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Post password reset'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Post('password/reset')
  async postPasswordReset(@Req() request: Request, @Body() passwordSetDto: PasswordSetDto): Promise<User> {
    return this.utilitiesService.postPasswordReset(request, passwordSetDto);
  }

  /** DUMMY */

  // prettier-ignore
  @ApiOperation({
    description: '## Test'
  })
  @ApiResponse({
    status: 200,
  })
  @Post('test')
  async postTestDummy(@Req() request: Request, @Body() body: any): Promise<any> {
    return this.utilitiesService.postTestDummy(request, body);
  }
}
