/** @format */

import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SettingsDto, SettingsUpdateDto } from './dto';
import { Settings } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Get user settings'
  })
  @ApiResponse({
    status: 200,
    type: SettingsDto
  })
  @ApiBearerAuth('access')
  @Get()
  @UseGuards(AuthGuard('access'))
  async confirmationGet(@Req() request: Request): Promise<Settings> {
    return this.settingsService.confirmationGet(request);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update user settings'
  })
  @ApiResponse({
    status: 200,
    type: SettingsDto
  })
  @ApiBearerAuth('access')
  @Put()
  @UseGuards(AuthGuard('access'))
  async confirmationUpdate(@Req() request: Request, @Body() settingsUpdateDto: SettingsUpdateDto): Promise<Settings> {
    return this.settingsService.confirmationUpdate(request, settingsUpdateDto);
  }
}
