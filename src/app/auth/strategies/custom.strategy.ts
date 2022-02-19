/** @format */

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from '../../core';
import { Token } from '@prisma/client';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {
    super();
  }

  async validate(request: Request, callback: any): Promise<any> {
    const access: string | undefined = request.headers.authorization;
    const resolveCallback = (id: number) => {
      callback(null, {
        id
      });
    };

    if (!access) {
      throw new UnauthorizedException();
    }

    try {
      const decode: any = await this.jwtService.verifyAsync(access.slice(7));

      resolveCallback(Number(decode.sub));
    } catch (error: any) {
      const isExpired: boolean = error instanceof TokenExpiredError;
      const isRefresh: boolean = request.url === '/api/auth/refresh';

      if (isExpired && isRefresh) {
        const refresh: string | undefined = request.signedCookies.refresh;

        if (!refresh) {
          throw new UnauthorizedException();
        }

        try {
          const decode: any = await this.jwtService.verifyAsync(refresh);
          const token: Token = await this.prismaService.token.delete({
            where: {
              id: Number(decode.jti)
            }
          });

          // TODO: compare fingerprint

          console.log(token);

          resolveCallback(Number(decode.sub));
        } catch (error: any) {
          throw new ForbiddenException();
        }
      }
    }
  }
}
