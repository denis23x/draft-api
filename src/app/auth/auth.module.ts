/** @format */

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  exports: [AuthService, FacebookStrategy, GoogleStrategy, JwtStrategy],
  providers: [AuthService, FacebookStrategy, GoogleStrategy, JwtStrategy]
})
export class AuthModule {}
