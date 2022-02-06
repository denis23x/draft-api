/** @format */

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { Token } from '@prisma/client';
import { PrismaService } from '../core';
import { hash } from 'bcrypt';

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

  async generateAccessToken(id: number): Promise<string> {
    const signOptions: SignOptions = {
      ...this.signOptions,
      subject: String(id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async generateRefreshToken(id: number, device: any): Promise<string> {
    const date: Date = new Date();
    const fingerprint: string = await hash(JSON.stringify(device), 0);

    const token: Token = await this.prismaService.token.create({
      data: {
        device,
        fingerprint,
        expiredAt: new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL))),
        user: {
          connect: {
            id
          }
        }
      }
    });

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(id),
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
