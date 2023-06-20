/** @format */

import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get request to confirm email'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('confirmation')
  @UseGuards(AuthGuard('access'))
  async confirmationGet(@Req() request: Request): Promise<User> {
    return this.emailService.confirmationGet(request);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update email confirmation'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Put('confirmation')
  async confirmationUpdate(@Req() request: Request, @Body() emailConfirmationUpdateDto: EmailConfirmationUpdateDto): Promise<User> {
    return this.emailService.confirmationUpdate(request, emailConfirmationUpdateDto);
  }
}
