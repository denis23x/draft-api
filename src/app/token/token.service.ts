/** @format */

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { Token, User } from '@prisma/client';
import { PrismaService } from '../core';

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

  async generateRefreshToken(id: number): Promise<string> {
    const date: Date = new Date();

    // @ts-ignore
    const token: Token = await this.prismaService.token.create({
      data: {
        userId: id,
        expiredAt: new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL)))
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

  async resolveRefreshToken(refreshToken: string): Promise<User> {
    const jwtDecodedPayload: JwtDecodedPayload = await this.decodeRefreshToken(refreshToken);

    const token: Token = await this.prismaService.token.delete({
      where: {
        id: Number(jwtDecodedPayload.jti)
      }
    });

    if (!token) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    // TODO: add categories

    return this.prismaService.user.findUnique({
      where: {
        id: Number(jwtDecodedPayload.sub)
      }
    });
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
