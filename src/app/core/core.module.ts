/** @format */

import { Module } from '@nestjs/common';
import { HelperService, JwtConfigService, PrismaService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [HelperService, JwtConfigService, PrismaService],
  exports: [HelperService, JwtConfigService, PrismaService]
})
export class CoreModule {}
