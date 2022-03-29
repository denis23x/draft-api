/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { FingerprintDto, LoginDto, RegistrationDto } from './dto';
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
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        categories: {
          ...this.prismaService.setCategorySelect(),
          ...this.prismaService.setOrder()
        }
      },
      where: {
        email: loginDto.email
      }
    };

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

  // prettier-ignore
  async registration(request: Request, response: Response, registrationDto: RegistrationDto): Promise<User> {
    if (registrationDto.hasOwnProperty('password')) {
      registrationDto.password = await hash(registrationDto.password, 10);
    }

    return this.prismaService.user.create({
      ...this.prismaService.setUserSelect(),
      data: registrationDto
    });
  }

  // prettier-ignore
  async refresh(request: Request, response: Response, fingerprintDto: FingerprintDto): Promise<User> {
    const user: User = await this.prismaService.user.findUnique({
      ...this.prismaService.setUserSelect(),
      where: {
        id: (request.user as any).id
      }
    });

    return this.setResponse(request, response, user, fingerprintDto);
  }

  async me(request: Request): Promise<User> {
    const { select } = this.prismaService.setUserSelect();

    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        ...select,
        categories: {
          ...this.prismaService.setCategorySelect(),
          ...this.prismaService.setOrder()
        }
      },
      where: {
        id: (request.user as any).id
      }
    };

    return this.prismaService.user.findUnique(userFindUniqueArgs);
  }

  async social(request: Request, response: Response, socialKey: string): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException();
    }

    const user: User = await this.prismaService.user.upsert({
      where: {
        email: (request.user as any).email
      },
      update: {
        [socialKey]: request.user[socialKey]
      },
      create: {
        ...(request.user as any)
      }
    });

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
    const { select } = this.prismaService.setUserSelect();

    for (const column in select) {
      !select[column] && delete user[column];
    }

    const session: Session = await this.setSession(request, user, fingerprintDto);

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
    const session: Session = await this.prismaService.session.findUnique({
      where: {
        fingerprint_userId: {
          fingerprint: fingerprintDto.fingerprint,
          userId: user.id
        }
      }
    });

    if (!!session) {
      await this.prismaService.session.delete({
        where: {
          id: session.id
        }
      });
    }

    return this.prismaService.session.create({
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
    });
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
