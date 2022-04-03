/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { FingerprintDto, LoginDto, LogoutDto, MeDto, RegistrationDto } from './dto';
import * as url from 'url';
import { Prisma, Session, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

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
        password: true
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
      }
    }

    const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

    const fingerprintDto: FingerprintDto = {
      fingerprint: loginDto.fingerprint
    };

    if (loginDto.hasOwnProperty('password')) {
      const password: boolean = await compare(loginDto.password, user.password);

      if (password) {
        return this.setResponse(request, response, user, fingerprintDto);
      }
    }

    for (const socialKey of ['googleId', 'facebookId']) {
      if (loginDto.hasOwnProperty(socialKey)) {
        if (loginDto[socialKey] === user[socialKey]) {
          return this.setResponse(request, response, user, fingerprintDto);
        }
      }
    }

    throw new UnauthorizedException();
  }

  async logout(request: Request, response: Response, logoutDto: LogoutDto): Promise<User> {
    // @ts-ignore
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        ...this.prismaService.setUserSelect(),
        password: true
      }
    };

    if (!!logoutDto) {
      /** Scope */
      // if (logoutDto.hasOwnProperty('scope')) {
      //   if (logoutDto.scope.includes('sessions')) {
      //     userFindUniqueArgs.select = {
      //       ...userFindUniqueArgs.select,
      //       sessions: {
      //         select: this.prismaService.setSessionSelect(),
      //         orderBy: {
      //           id: 'desc'
      //         }
      //       }
      //     };
      //   }
      // }
    }

    return this.prismaService.user.findUnique(userFindUniqueArgs);
  }

  // prettier-ignore
  async registration(request: Request, response: Response, registrationDto: RegistrationDto): Promise<User> {
    const userCreateArgs: Prisma.UserCreateArgs = {
      select: this.prismaService.setUserSelect(),
      data: registrationDto
    };

    if (registrationDto.hasOwnProperty('password')) {
      registrationDto.password = await hash(registrationDto.password, 10);
    }

    return this.prismaService.user.create(userCreateArgs);
  }

  // prettier-ignore
  async refresh(request: Request, response: Response, fingerprintDto: FingerprintDto): Promise<User> {
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id: (request.user as any).id
      }
    };

    const user: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

    return this.setResponse(request, response, user, fingerprintDto);
  }

  async me(request: Request, response: Response, meDto: MeDto): Promise<User> {
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id: (request.user as any).id
      }
    };

    if (!!meDto) {
      /** Scope */

      if (meDto.hasOwnProperty('scope')) {
        if (meDto.scope.includes('categories')) {
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

        if (meDto.scope.includes('posts')) {
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

        if (meDto.scope.includes('sessions')) {
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
      }
    }

    return this.prismaService.user.findUnique(userFindUniqueArgs);
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
        ...(request.user as any)
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

  // prettier-ignore
  async setResponse(request: Request, response: Response, user: User, fingerprintDto: FingerprintDto): Promise<User> {
    const userSelect: Prisma.UserSelect = this.prismaService.setUserSelect();

    for (const column in userSelect) {
      !userSelect[column] && delete user[column];
    }

    const session: Session = await this.setSession(request, user, fingerprintDto);

    /** Generate tokens */

    const accessToken: string = await this.setToken(session, user, process.env.JWT_ACCESS_TTL);
    const refreshToken: string = await this.setToken(session, user, process.env.JWT_REFRESH_TTL);

    // TODO: enable secure and sameSite (need HTTPS)
    // secure: true,
    // sameSite: 'none'

    response.cookie('refreshToken', refreshToken, {
      domain: process.env.APP_COOKIE_DOMAIN,
      path: '/api/auth',
      signed: true,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TTL)
    });

    return {
      ...user,
      // @ts-ignore
      accessToken
    };
  }

  // prettier-ignore
  async setSession(request: Request, user: User, fingerprintDto?: FingerprintDto): Promise<Session> {
    const sessionFindUniqueArgs: Prisma.SessionFindUniqueArgs = {
      where: {
        fingerprint_userId: {
          fingerprint: fingerprintDto.fingerprint,
          userId: user.id
        }
      }
    };

    const session: Session = await this.prismaService.session.findUnique(sessionFindUniqueArgs);

    if (!!session) {
      const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
        where: {
          id: session.id
        }
      };

      await this.prismaService.session.delete(sessionDeleteArgs);
    }

    const sessionCreateArgs: Prisma.SessionCreateArgs = {
      data: {
        ua: request.headers['user-agent'],
        fingerprint: fingerprintDto.fingerprint,
        ip: request.ip,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    };

    return this.prismaService.session.create(sessionCreateArgs);
  }

  async setToken(session: Session, user: User, expiresIn: string): Promise<string> {
    const payload: any = {};
    const options: JwtSignOptions = {
      expiresIn: Number(expiresIn),
      subject: String(user.id),
      jwtid: String(session.id)
    };

    return this.jwtService.signAsync(payload, options);
  }
}
