/** @format */

import { Body, Controller, Post, Req } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { Request } from 'express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Utilities')
@Controller('utilities')
export class UtilitiesController {
  constructor(private readonly utilitiesService: UtilitiesService) {}

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
