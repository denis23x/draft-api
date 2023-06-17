/** @format */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy, GoogleStrategy, AccessStrategy, GithubStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { JwtConfigService } from '../core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useExisting: JwtConfigService
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, GithubStrategy, AccessStrategy],
  exports: [AuthService, FacebookStrategy, GoogleStrategy, GithubStrategy, AccessStrategy]
})
export class AuthModule {}
