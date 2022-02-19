/** @format */

import { Module } from '@nestjs/common';
import { HelperService, PrismaService } from './services';

@Module({
  providers: [HelperService, PrismaService],
  exports: [HelperService, PrismaService]
})
export class CoreModule {}
