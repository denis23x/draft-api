/** @format */

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import { FingerprintDto, LoginDto, LogoutDto, TokenDto } from './dto';
import { Prisma, Session, User } from '../../database/client';
import { PrismaService } from '../core';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async login(request: Request, response: Response, loginDto: LoginDto): Promise<User> {
    // @ts-ignore
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        ...this.prismaService.setUserSelect(),
        password: true,
        facebookId: true,
        githubId: true,
        googleId: true,
        settings: {
          select: this.prismaService.setSettingsSelect()
        }
      }
    };

    if (!!loginDto) {
      /** Search */

      if (loginDto.hasOwnProperty('email')) {
        userFindUniqueArgs.where = {
          email: loginDto.email
        };
      }
    }

    const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

    if (!!user) {
      let isAuthenticated: boolean = false;

      /** Login by password */

      if (loginDto.hasOwnProperty('password')) {
        isAuthenticated = await compare(loginDto.password, user.password);
      }

      /** Login by social authorization */

      for (const socialId of ['facebookId', 'githubId', 'googleId']) {
        if (loginDto.hasOwnProperty(socialId)) {
          isAuthenticated = loginDto[socialId] === user[socialId];
        }
      }

      if (isAuthenticated) {
        const sessionUpsertArgs: Prisma.SessionUpsertArgs = {
          where: {
            fingerprint_userId: {
              fingerprint: loginDto.fingerprint,
              userId: user.id
            }
          },
          update: {
            ua: request.headers['user-agent'],
            fingerprint: loginDto.fingerprint,
            ip: request.ip,
            refresh: randomUUID(),
            expires: String(Date.now() + Number(this.configService.get('JWT_REFRESH_TTL')))
          },
          create: {
            ua: request.headers['user-agent'],
            fingerprint: loginDto.fingerprint,
            ip: request.ip,
            refresh: randomUUID(),
            expires: String(Date.now() + Number(this.configService.get('JWT_REFRESH_TTL'))),
            user: {
              connect: {
                id: user.id
              }
            }
          }
        };

        return this.prismaService.session
          .upsert(sessionUpsertArgs)
          .then((session: Session) => this.setRefresh(response, session))
          .then((session: Session) => this.setAccess(user, session));
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new NotFoundException();
    }
  }

  async logout(request: Request, response: Response, logoutDto: LogoutDto): Promise<Session> {
    const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
      select: this.prismaService.setSessionSelect(),
      where: {
        fingerprint_userId: {
          fingerprint: logoutDto.fingerprint,
          userId: (request.user as any).id
        }
      }
    };

    return this.setUnauthorized(response).then(() => {
      return this.prismaService.session.delete(sessionDeleteArgs);
    });
  }

  // prettier-ignore
  async refresh(request: Request, response: Response, fingerprintDto: FingerprintDto): Promise<User> {
    const sessionFindFirstArgs: Prisma.SessionFindFirstArgs = {
      where: {
        refresh: request.signedCookies.refresh
      }
    };

    const session: Session = await this.prismaService.session
      .findFirst(sessionFindFirstArgs)
      .then((session: Session) => this.setUnauthorized(response, session));

    if (!!session) {
      const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
        where: {
          id: session.id
        }
      };

      await this.prismaService.session.delete(sessionDeleteArgs);

      const isExpired: boolean = Date.now() > Number(session.expires);
      const isFingerprintInvalid: boolean = fingerprintDto.fingerprint !== session.fingerprint;

      if (!isExpired && !isFingerprintInvalid) {
        const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
          select: this.prismaService.setUserSelect(),
          where: {
            id: session.userId
          }
        };

        const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

        const sessionCreateArgs: Prisma.SessionCreateArgs = {
          data: {
            ua: request.headers['user-agent'],
            fingerprint: fingerprintDto.fingerprint,
            ip: request.ip,
            refresh: randomUUID(),
            expires: String(Date.now() + Number(this.configService.get('JWT_REFRESH_TTL'))),
            user: {
              connect: {
                id: user.id
              }
            }
          }
        };

        return this.prismaService.session
          .create(sessionCreateArgs)
          .then((session: Session) => this.setRefresh(response, session))
          .then((session: Session) => this.setAccess(user, session));
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  async social(request: Request, response: Response, socialId: string): Promise<void> {
    if (!!request.user) {
      const userUpsertArgs: Prisma.UserUpsertArgs = {
        where: {
          email: (request.user as any).email
        },
        update: {
          [socialId]: request.user[socialId]
        },
        create: {
          ...(request.user as any),
          settings: {
            create: {}
          }
        }
      };

      const user: User = await this.prismaService.user.upsert(userUpsertArgs);

      const getUrl = (): string => {
        const url: URL = new URL(this.configService.get('APP_SITE_ORIGIN'));
        const urlSearchParams: URLSearchParams = new URLSearchParams([
          ['email', user.email],
          [socialId, user[socialId]]
        ]);

        url.pathname = '/login';
        url.search = urlSearchParams.toString();

        return url.href;
      };

      return response.redirect(getUrl());
    }

    throw new UnauthorizedException();
  }

  /** JWT */

  async setRefresh(response: Response, session: Session): Promise<Session> {
    // TODO: enable secure and sameSite (need HTTPS)

    response.cookie('refresh', session.refresh, {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/api/auth',
      signed: true,
      httpOnly: true,
      expires: new Date(Number(session.expires))
      // secure: true,
      // sameSite: 'none'
    });

    return session;
  }

  async setAccess(user: User, session: Session): Promise<User & TokenDto> {
    const userSelect: Prisma.UserSelect = this.prismaService.setUserSelect();

    for (const column in userSelect) {
      if (!userSelect[column]) {
        delete user[column];
      }
    }

    // prettier-ignore
    return {
      ...user,
      token: await this.jwtService.signAsync({}, {
        expiresIn: Number(this.configService.get('JWT_ACCESS_TTL')),
        subject: String(user.id),
        jwtid: String(session.id)
      })
    };
  }

  async setUnauthorized(response: Response, session?: Session): Promise<Session> {
    // TODO: enable secure and sameSite (need HTTPS)

    response.cookie('refresh', String(0), {
      domain: this.configService.get('COOKIE_DOMAIN'),
      path: '/api/auth',
      signed: true,
      httpOnly: true,
      expires: new Date()
      // secure: true,
      // sameSite: 'none'
    });

    return session;
  }
}
