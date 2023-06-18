/** @format */

import { Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfirmationUpdateDto } from './dto';
import { UserDto } from '../user/dto';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { UserRelationGuard } from '../auth/guards';

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
  @Get('confirmation/:id')
  @UseGuards(AuthGuard('access'), UserRelationGuard)
  async getConfirmation(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.emailService.getConfirmation(request, id);
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
