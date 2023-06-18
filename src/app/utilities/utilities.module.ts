/** @format */

import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';

@Module({
  controllers: [UtilitiesController],
  exports: [UtilitiesService],
  providers: [UtilitiesService]
})
export class UtilitiesModule {}
