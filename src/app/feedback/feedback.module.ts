/** @format */

import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FeedbackController],
  exports: [FeedbackService],
  providers: [FeedbackService]
})
export class FeedbackModule {}
