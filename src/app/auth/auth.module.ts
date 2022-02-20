/** @format */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy, GoogleStrategy, CustomStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        secret: process.env.JWT_SECRET
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, CustomStrategy],
  exports: [AuthService, FacebookStrategy, GoogleStrategy, CustomStrategy]
})
export class AuthModule {}
