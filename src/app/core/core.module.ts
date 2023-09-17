/** @format */

import { Module } from '@nestjs/common';
import {
  BucketService,
  HelperService,
  JwtConfigService,
  PrismaService,
  SharpService
} from './services';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [BucketService, HelperService, JwtConfigService, PrismaService, SharpService],
  exports: [BucketService, HelperService, JwtConfigService, PrismaService, SharpService]
})
export class CoreModule {}
