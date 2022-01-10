/** @format */

import { Module } from '@nestjs/common';
import { HelperService } from './services';

@Module({
  exports: [HelperService],
  providers: [HelperService]
})
export class CoreModule {}
