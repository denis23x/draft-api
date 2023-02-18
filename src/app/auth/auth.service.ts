/** @format */

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { FingerprintDto, LoginDto, LogoutDto, TokenDto } from './dto';
import * as url from 'url';
import { Prisma, Session, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
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
      // for (const socialKey of ['facebookId', 'githubId', 'googleId']) {
      //   if (loginDto.hasOwnProperty(socialKey)) {
      //     if (loginDto[socialKey] === user[socialKey]) {
      //       return this.setResponse(request, response, user, fingerprintDto);
      //     }
      //   }
      // }

      const authenticated: boolean = await compare(loginDto.password, user.password);

      if (authenticated) {
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
            expires: String(Date.now() + Number(process.env.JWT_REFRESH_TTL))
          },
          create: {
            ua: request.headers['user-agent'],
            fingerprint: loginDto.fingerprint,
            ip: request.ip,
            refresh: randomUUID(),
            expires: String(Date.now() + Number(process.env.JWT_REFRESH_TTL)),
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
      }
    } else {
      throw new NotFoundException();
    }

    throw new UnauthorizedException();
  }

  async logout(request: Request, response: Response, logoutDto: LogoutDto): Promise<any> {
    const sessionFindUniqueArgs: Prisma.SessionFindUniqueArgs = {
      select: {
        userId: true
      },
      where: {}
    };

    if (!!logoutDto) {
      /** Search */

      if (logoutDto.hasOwnProperty('id')) {
        sessionFindUniqueArgs.where = {
          id: logoutDto.id
        };

        const session: Session = await this.prismaService.session.findUnique(sessionFindUniqueArgs);

        if (session.userId === (request.user as any).id) {
          const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
            where: {
              id: logoutDto.id
            }
          };

          return this.prismaService.session.delete(sessionDeleteArgs);
        } else {
          throw new UnauthorizedException();
        }
      } else {
        const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
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
    }

    throw new UnauthorizedException();
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
      }

      await this.prismaService.session.delete(sessionDeleteArgs);

      const isExpired: boolean = Date.now() > Number(session.expires);
      const isFingerprintInvalid: boolean = fingerprintDto.fingerprint !== session.fingerprint;

      if (!isExpired && !isFingerprintInvalid) {
        const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
          select: {
            ...this.prismaService.setUserSelect(),
            settings: {
              select: this.prismaService.setSettingsSelect()
            }
          },
          where: {
            id: session.userId
          }
        }

        const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

        const sessionCreateArgs: Prisma.SessionCreateArgs = {
          data: {
            ua: request.headers['user-agent'],
            fingerprint: fingerprintDto.fingerprint,
            ip: request.ip,
            refresh: randomUUID(),
            expires: String(Date.now() + Number(process.env.JWT_REFRESH_TTL)),
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

  async social(request: Request, response: Response, socialKey: string): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const userUpsertArgs: Prisma.UserUpsertArgs = {
      where: {
        email: (request.user as any).email
      },
      update: {
        [socialKey]: request.user[socialKey]
      },
      create: {
        ...(request.user as any),
        description: "I'm new here",
        settings: {
          create: {
            theme: 'light',
            background: 'pattern-randomized',
            language: 'en',
            monospace: true,
            buttons: 'left'
          }
        }
      }
    };

    const user: User = await this.prismaService.user.upsert(userUpsertArgs);

    return response.redirect(
      url.format({
        pathname: process.env.APP_SITE_ORIGIN + '/login',
        query: {
          email: user.email,
          [socialKey]: user[socialKey]
        }
      })
    );
  }

  /** JWT */

  async setRefresh(response: Response, session: Session): Promise<Session> {
    // TODO: enable secure and sameSite (need HTTPS)

    response.cookie('refresh', session.refresh, {
      domain: process.env.APP_COOKIE_DOMAIN,
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
        expiresIn: Number(process.env.JWT_ACCESS_TTL),
        subject: String(user.id),
        jwtid: String(session.id)
      })
    };
  }

  async setUnauthorized(response: Response, session?: Session): Promise<Session> {
    response.clearCookie('authed');
    response.clearCookie('theme');

    // TODO: enable secure and sameSite (need HTTPS)

    response.cookie('refresh', String(0), {
      domain: process.env.APP_COOKIE_DOMAIN,
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
