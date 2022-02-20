/** @format */

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';
import { PrismaService } from '../../core';
import { Session } from '@prisma/client';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {
    super();
  }

  /** AUTHENTICATION
   *
   * On login client provide credentials and fingerprint
   * If credentials are valid server creates session and gives client a pair of tokens
   * Pair of tokens are equal and contain only JwtSignOptions without user payload
   *
   * ACCESS token has lifetime 30 minutes and kept on client side (localStorage)
   * Client using it for authenticated requests, putting it in authorization headers
   *
   * REFRESH token has lifetime 30 days and kept on client side (httpOnly cookie)
   * Client can't use it, it will be automatically provided in any "/api/auth" request
   *
   * On every authenticated request, server verifying ACCESS token for availability, lifetime and trues
   * If ACCESS token not provided, malformed or expired serves gives UnauthorizedException
   *
   * On UnauthorizedException client provide his fingerprint on "/api/auth/refresh"
   * Server verifying REFRESH token for availability, lifetime and trues
   * If REFRESH token not provided, malformed or expired serves gives UnauthorizedException
   * If REFRESH token is correct server delete session and doing additional checking
   *  - Comparing REFRESH id with ACCESS token id
   *  - Comparing provided fingerprint with session fingerprint
   * If ids or fingerprints not equal serves gives ForbiddenException
   * If all good server pass request to refresh tokens method
   */

  async validate(request: Request, callback: any): Promise<void> {
    const accessToken: string | undefined = request.headers.authorization;
    const resolve = (id: number): void => {
      callback(null, {
        id
      });
    };

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    try {
      const accessDecoded: any = await this.jwtService.verifyAsync(accessToken.slice(7));

      resolve(Number(accessDecoded.sub));
    } catch (error: any) {
      const isExpired: boolean = error instanceof TokenExpiredError;
      const isRefresh: boolean = request.url === '/api/auth/refresh';

      if (isExpired && isRefresh) {
        const refreshToken: string | undefined = request.signedCookies.refreshToken;

        if (!refreshToken) {
          throw new UnauthorizedException();
        }

        try {
          const accessDecoded: any = await this.jwtService.decode(accessToken.slice(7));
          const refreshDecoded: any = await this.jwtService.verifyAsync(refreshToken);

          const session: Session = await this.prismaService.session.delete({
            where: {
              id: Number(refreshDecoded.jti)
            }
          });

          const invalidJti: boolean = accessDecoded.jti !== refreshDecoded.jti;
          const invalidFingerprint: boolean = request.body.fingerprint !== session.fingerprint;

          if (invalidJti || invalidFingerprint) {
            throw new ForbiddenException();
          }

          resolve(Number(refreshDecoded.sub));
        } catch (error: any) {
          throw new UnauthorizedException();
        }
      }
    }
  }
}
