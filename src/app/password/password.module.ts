/** @format */

import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
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
  controllers: [PasswordController],
  exports: [PasswordService],
  providers: [PasswordService]
})
export class PasswordModule {}
