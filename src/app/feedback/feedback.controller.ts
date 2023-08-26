/** @format */

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedbackCreateDto, FeedbackDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Feedback')
@Controller('feedbacks')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Create feedback'
  })
  @ApiResponse({
    status: 201,
    type: FeedbackDto
  })
  @ApiBearerAuth('access')
  @Post()
  @UseGuards(AuthGuard('access'))
  async create(@Req() request: Request, @Body() feedbackCreateDto: FeedbackCreateDto): Promise<FeedbackDto> {
    return this.feedbackService.create(request, feedbackCreateDto);
  }
}
