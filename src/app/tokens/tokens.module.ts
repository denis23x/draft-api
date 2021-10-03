/** @format */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensRepository } from './tokens.repository';
import { Token } from './tokens.entity';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Token]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_ACCESS_TTL
        }
      })
    })
  ],
  exports: [TokensService, TokensRepository],
  providers: [TokensService, TokensRepository]
})
export class TokensModule {}
