/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from '../../core';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {
    super();
  }

  async validate(request: Request): Promise<any> {
    const access: string | undefined = request.headers.authorization;

    if (!access) {
      throw new UnauthorizedException();
    }

    await this.validateAccess(request);

    console.log('call me?');

    // TODO: request.user

    return {
      id: 'asd'
    };
  }

  async validateAccess(request: Request): Promise<void> {
    try {
      await this.jwtService.verifyAsync(request.headers.authorization.slice(7));
    } catch (error: any) {
      switch (true) {
        case error instanceof TokenExpiredError: {
          if (request.url === '/api/auth/refresh') {
            const refresh: string | undefined = request.signedCookies.refresh;

            if (!refresh) {
              throw new UnauthorizedException();
            }

            await this.validateRefresh(request);
          }

          throw new UnauthorizedException();
        }
        default: {
          throw new UnauthorizedException();
        }
      }
    }
  }

  async validateRefresh(request: Request): Promise<void> {
    try {
      await this.jwtService.verifyAsync(request.signedCookies.refresh);

      const decode = await this.jwtService.verifyAsync(request.signedCookies.refresh);
      const database = await this.prismaService.token.findUnique({
        where: {
          id: Number(decode.jti)
        }
      });

      console.log(decode);
      console.log(database);
    } catch (error: any) {
      throw new UnauthorizedException();
    }
  }
}
