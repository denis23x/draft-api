/** @format */

import { Module } from '@nestjs/common';
import { HelperService, JwtConfigService, PrismaService, WinstonService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [HelperService, JwtConfigService, PrismaService, WinstonService],
  exports: [HelperService, JwtConfigService, PrismaService, WinstonService]
})
export class CoreModule {}
