/** @format */

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { User } from '@prisma/client';
import { PrismaService } from '../core';
import { hash } from 'bcrypt';
import { Request } from 'express';
import DeviceDetector = require('device-detector-js');

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

  async generateAccessToken(request: Request, user: User): Promise<string> {
    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_ACCESS_TTL),
      subject: String(user.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async generateRefreshToken(request: Request, user: User): Promise<string> {
    /** DETECT DEVICE */

    const deviceDetector: any = new DeviceDetector();
    const device: any = deviceDetector.parse(request.headers['user-agent']);

    const date: Date = new Date();
    const fingerprint: string = await hash(JSON.stringify(device), 10);

    const refreshToken: string = request.signedCookies.refreshToken;

    let token: any = {};

    // TODO: REWRITE

    if (!refreshToken) {
      token = await this.prismaService.token.create({
        data: {
          device,
          fingerprint,
          expire: new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL))),
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });
    } else {
      // prettier-ignore
      const jwtDecodedPayload: JwtDecodedPayload = await this.decodeRefreshToken(refreshToken);

      token = await this.prismaService.token.upsert({
        where: {
          id: Number(jwtDecodedPayload.jti)
        },
        update: {
          expire: new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL)))
        },
        create: {
          device,
          fingerprint,
          expire: new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL))),
          user: {
            connect: {
              id: user.id
            }
          }
        }
      });
    }

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async decodeRefreshToken(token: string): Promise<JwtDecodedPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }
}
