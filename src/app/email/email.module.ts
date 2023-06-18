/** @format */

import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
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
  controllers: [EmailController],
  exports: [EmailService],
  providers: [EmailService]
})
export class EmailModule {}
