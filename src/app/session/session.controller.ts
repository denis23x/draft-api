/** @format */

import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SessionDto } from './dto';
import { Session } from '../../database/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  constructor(private readonly settingsService: SessionService) {}

  @ApiOperation({
    description: '## Get all sessions'
  })
  @ApiResponse({
    status: 200,
    type: SessionDto
  })
  @ApiBearerAuth('access')
  @Get()
  @UseGuards(AuthGuard('access'))
  async getAll(@Req() request: Request): Promise<Session[]> {
    return this.settingsService.getAll(request);
  }

  @ApiOperation({
    description: '## Delete session'
  })
  @ApiResponse({
    status: 200,
    type: SessionDto
  })
  @ApiBearerAuth('access')
  @Delete(':id')
  @UseGuards(AuthGuard('access'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<Session> {
    return this.settingsService.delete(request, id);
  }
}
