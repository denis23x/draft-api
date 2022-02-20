/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { LoginDto, RegistrationDto } from './dto';
import * as url from 'url';
import { Session, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async login(request: Request, response: Response, loginDto: LoginDto): Promise<User> {
    // TODO: add categories

    const user: User = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email
      }
    });

    if (loginDto.hasOwnProperty('password')) {
      const password: boolean = await compare(loginDto.password, user.password);

      if (password) {
        return this.setResponse(request, response, user);
      }
    }

    for (const socialKey of ['googleId', 'facebookId']) {
      if (loginDto.hasOwnProperty(socialKey)) {
        if (loginDto[socialKey] === user[socialKey]) {
          return this.setResponse(request, response, user);
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
      ...this.prismaService.setNonSensitiveUserSelect(),
      data: registrationDto
    });
  }

  async refresh(request: Request, response: Response): Promise<any> {
    const user: User = await this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id: (request.user as any).id
      }
    });

    return this.setResponse(request, response, user);
  }

  async me(request: Request): Promise<User> {
    // TODO: add categories

    return this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id: (request.user as any).id
      }
    });
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

  async setResponse(request: Request, response: Response, user: User): Promise<User> {
    const { select } = this.prismaService.setNonSensitiveUserSelect();

    for (const column in select) {
      !select[column] && delete user[column];
    }

    const session: Session = await this.setSession(request, user);

    const access: string = await this.setToken(session, user, process.env.JWT_ACCESS_TTL);
    const refresh: string = await this.setToken(session, user, process.env.JWT_REFRESH_TTL);

    // TODO: enable secure and sameSite (need HTTPS)
    // secure: true,
    // sameSite: 'none'

    response.cookie('refresh', refresh, {
      domain: process.env.APP_COOKIE_DOMAIN,
      path: '/api/auth',
      signed: true,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TTL)
    });

    return {
      ...user,
      // @ts-ignore
      access
    };
  }

  async setSession(request: Request, user: User): Promise<Session> {
    const refresh: string | undefined = request.signedCookies.refresh;

    if (!!refresh) {
      const jwtDecodedPayload: any = await this.jwtService.verifyAsync(refresh);

      const session: Session = await this.prismaService.session.findUnique({
        where: {
          id: Number(jwtDecodedPayload.jti)
        }
      });

      if (!!session) {
        await this.prismaService.session.delete({
          where: {
            id: Number(jwtDecodedPayload.jti)
          }
        });
      }
    }

    return this.prismaService.session.create({
      data: {
        ua: request.headers['user-agent'],
        fingerprint: request.body.fingerprint,
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
