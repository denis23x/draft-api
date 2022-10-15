/** @format */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy, GoogleStrategy, CustomStrategy, GithubStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (): Promise<any> => ({
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, GithubStrategy, CustomStrategy],
  exports: [AuthService, FacebookStrategy, GoogleStrategy, GithubStrategy, CustomStrategy]
})
export class AuthModule {}
