/** @format */

import { Module } from '@nestjs/common';
import { HelperService, ImageService, JwtConfigService, PrismaService } from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [HelperService, ImageService, JwtConfigService, PrismaService],
  exports: [HelperService, ImageService, JwtConfigService, PrismaService]
})
export class CoreModule {}
