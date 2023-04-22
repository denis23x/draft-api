/** @format */

import { Module } from '@nestjs/common';
import { HelperService, PrismaService, WinstonService } from './services';

@Module({
  providers: [HelperService, WinstonService, PrismaService],
  exports: [HelperService, WinstonService, PrismaService]
})
export class CoreModule {}
