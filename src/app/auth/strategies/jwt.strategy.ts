/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../core';
import { User } from '@prisma/client';
import { JwtDecodedPayload } from '../auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(jwtDecodedPayload: JwtDecodedPayload): Promise<User> {
    // TODO: add categories

    return this.prismaService.user.findUnique({
      where: {
        id: Number(jwtDecodedPayload.sub)
      }
    });
  }
}
