/** @format */

import { Global, Module } from '@nestjs/common';
import { HelperService, PrismaService } from './services';

@Global()
@Module({
  providers: [HelperService, PrismaService],
  exports: [HelperService, PrismaService]
})
export class CoreModule {}
