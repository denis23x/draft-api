/** @format */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy, GoogleStrategy, CustomStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, FacebookStrategy, GoogleStrategy, CustomStrategy],
  exports: [AuthService, TokenService, FacebookStrategy, GoogleStrategy, CustomStrategy]
})
export class AuthModule {}
