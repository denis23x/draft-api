/** @format */

import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailConfirmationDto } from './dto';
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
