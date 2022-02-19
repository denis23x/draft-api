/** @format */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { User, Token } from '@prisma/client';
import { PrismaService } from '../core';
import { Request } from 'express';

@Injectable()
export class TokenService {
  signOptions: SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async createAccess(request: Request, user: User): Promise<string> {
    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_ACCESS_TTL),
      subject: String(user.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async createRefresh(request: Request, user: User): Promise<string> {
    const token: Token = await this.prismaService.token.create({
      data: {
        ua: request.headers['user-agent'],
        fingerprint: request.body.fingerprint,
        ip: request.ip,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async upsertRefresh(request: Request, user: User): Promise<string> {
    // prettier-ignore
    const jwtDecodedPayload: JwtDecodedPayload = await this.jwtService.verifyAsync(request.signedCookies.refresh);

    const payload: any = {
      ua: request.headers['user-agent'],
      fingerprint: request.body.fingerprint,
      ip: request.ip,
      user: {
        connect: {
          id: user.id
        }
      }
    };

    const token: Token = await this.prismaService.token.upsert({
      where: {
        id: Number(jwtDecodedPayload.jti)
      },
      update: payload,
      create: payload
    });

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }
}
