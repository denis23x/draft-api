/** @format */

import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmationUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get confirmation'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('confirmation')
  @UseGuards(AuthGuard('access'))
  async getConfirmation(@Req() request: Request): Promise<User> {
    return this.emailService.getConfirmation(request);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Post confirmation'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Post('confirmation')
  async postConfirmation(@Req() request: Request, @Query() confirmationUpdateDto: ConfirmationUpdateDto): Promise<User> {
    return this.emailService.postConfirmation(request, confirmationUpdateDto);
  }
}
