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

  @ApiOperation({
    description: '## Get settings'
  })
  @ApiResponse({
    status: 200,
    type: SettingsDto
  })
  @ApiBearerAuth('access')
  @Get()
  @UseGuards(AuthGuard('access'))
  async getOne(@Req() request: Request): Promise<Settings> {
    return this.settingsService.getOne(request);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update settings'
  })
  @ApiResponse({
    status: 200,
    type: SettingsDto
  })
  @ApiBearerAuth('access')
  @Put()
  @UseGuards(AuthGuard('access'))
  async update(@Req() request: Request, @Body() settingsUpdateDto: SettingsUpdateDto): Promise<Settings> {
    return this.settingsService.update(request, settingsUpdateDto);
  }
}
