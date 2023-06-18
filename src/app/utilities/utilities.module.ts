/** @format */

import { Module } from '@nestjs/common';
import { UtilitiesService } from './utilities.service';
import { UtilitiesController } from './utilities.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../core';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useExisting: JwtConfigService
    })
  ],
  controllers: [UtilitiesController],
  exports: [UtilitiesService],
  providers: [UtilitiesService]
})
export class UtilitiesModule {}
