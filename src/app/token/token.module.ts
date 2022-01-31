/** @format */

import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_ACCESS_TTL
        }
      })
    })
  ],
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule {}
