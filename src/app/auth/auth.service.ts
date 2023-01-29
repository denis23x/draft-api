/** @format */

import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { FingerprintDto, LoginDto, LogoutDto } from './dto';
import * as url from 'url';
import { Prisma, Session, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { from, map, switchMap } from 'rxjs';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async login(request: Request, response: Response, loginDto: LoginDto): Promise<any> {
    // @ts-ignore
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        ...this.prismaService.setUserSelect(),
        password: true,
        facebookId: true,
        githubId: true,
        googleId: true
      }
    };

    if (!!loginDto) {
      /** Search */

      if (loginDto.hasOwnProperty('email')) {
        userFindUniqueArgs.where = {
          email: loginDto.email
        };
      }

      /** Scope */

      if (loginDto.hasOwnProperty('scope')) {
        if (loginDto.scope.includes('categories')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            categories: {
              select: this.prismaService.setCategorySelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (loginDto.scope.includes('posts')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            posts: {
              select: this.prismaService.setPostSelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (loginDto.scope.includes('sessions')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            sessions: {
              select: this.prismaService.setSessionSelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (loginDto.scope.includes('settings')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            settings: {
              select: this.prismaService.setSettingsSelect()
            }
          };
        }
      }
    }

    const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

    if (!!user) {
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
            ua: {}, // request.headers['user-agent']
            fingerprint: loginDto.fingerprint,
            ip: {}, // request.ip
            refresh: randomUUID(),
            expires: Date.now() + Number(process.env.JWT_REFRESH_TTL)
          },
          create: {
            ua: {},
            fingerprint: loginDto.fingerprint,
            ip: {},
            refresh: randomUUID(),
            expires: Date.now() + Number(process.env.JWT_REFRESH_TTL),
            user: {
              connect: {
                id: user.id
              }
            }
          }
        };

        return from(this.prismaService.session.upsert(sessionUpsertArgs)).pipe(
          switchMap((session: Session) => {
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

            const jwtSignOptions: JwtSignOptions = {
              expiresIn: Number(process.env.JWT_ACCESS_TTL),
              subject: String(user.id),
              jwtid: String(session.id)
            };

            return this.jwtService.signAsync({}, jwtSignOptions);
          }),
          map((token: string) => {
            const userSelect: Prisma.UserSelect = this.prismaService.setUserSelect();

            for (const column in userSelect) {
              !userSelect[column] && delete user[column];
            }

            return {
              ...user,
              token
            };
          })
        );
      }
    } else {
      throw new NotFoundException();
    }

    throw new UnauthorizedException();
  }

  async logout(request: Request, response: Response, logoutDto: LogoutDto): Promise<User> {
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id: (request.user as any).id
      }
    };

    if (!!logoutDto) {
      /** Search */

      if (logoutDto.hasOwnProperty('id')) {
        const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
          where: {
            id: logoutDto.id
          }
        };

        await this.prismaService.session.delete(sessionDeleteArgs);
      } else {
        const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
          where: {
            fingerprint_userId: {
              fingerprint: logoutDto.fingerprint,
              userId: (request.user as any).id
            }
          }
        };

        await this.prismaService.session.delete(sessionDeleteArgs);
      }
    }

    response.clearCookie('refresh');

    return this.prismaService.user.findUnique(userFindUniqueArgs);
  }

  // prettier-ignore
  async refresh(request: Request, response: Response, fingerprintDto: FingerprintDto): Promise<any> {
    const session: Session = await this.prismaService.session.findFirst({
      where: {
        refresh: request.signedCookies.refresh
      }
    });

    if (!!session) {
      await this.prismaService.session.delete({
        where: {
          id: session.id
        }
      });

      const isExpired: boolean = Date.now() > session.expires;
      const isFingerprint: boolean = fingerprintDto.fingerprint !== session.fingerprint;

      if (isExpired || isFingerprint) {
        throw new UnauthorizedException();
      } else {
        // @ts-ignore
        const user: User = await this.prismaService.user.findUnique({
          select: {
            ...this.prismaService.setUserSelect(),
            settings: {
              select: this.prismaService.setSettingsSelect()
            }
          },
          where: {
            id: session.userId
          }
        });

        const sessionCreateArgs: Prisma.SessionCreateArgs = {
          data: {
            ua: {},
            fingerprint: fingerprintDto.fingerprint,
            ip: {},
            refresh: randomUUID(),
            expires: Date.now() + Number(process.env.JWT_REFRESH_TTL),
            user: {
              connect: {
                id: user.id
              }
            }
          }
        };

        return from(this.prismaService.session.create(sessionCreateArgs)).pipe(
          switchMap((session: Session) => {
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

            const jwtSignOptions: JwtSignOptions = {
              expiresIn: Number(process.env.JWT_ACCESS_TTL),
              subject: String(user.id),
              jwtid: String(session.id)
            };

            return this.jwtService.signAsync({}, jwtSignOptions);
          }),
          map((token: string) => {
            const userSelect: Prisma.UserSelect = this.prismaService.setUserSelect();

            for (const column in userSelect) {
              !userSelect[column] && delete user[column];
            }

            return {
              ...user,
              token
            };
          })
        )
      }
    } else {
      response.clearCookie('refresh');

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
        pathname: process.env.APP_SITE_ORIGIN + '/auth/login',
        query: {
          email: user.email,
          [socialKey]: user[socialKey]
        }
      })
    );
  }
}
