/** @format */

import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { LoginDto, RegistrationDto } from './dto';
import * as url from 'url';
import { Token, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import { JwtDecodedPayload } from './auth.interface';

@Injectable()
export class AuthService {
  signOptions: SignOptions = {
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE
  };

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

  async refresh(request: Request, response: Response): Promise<User> {
    const refreshToken: string = request.signedCookies.refreshToken;

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    // prettier-ignore
    // const jwtDecodedPayload: JwtDecodedPayload = await this.tokenService.decodeRefreshToken(refreshToken);

    // TODO: update refresh auth

    const user: User = await this.prismaService.user.findUnique({
      where: {
        // id: Number(jwtDecodedPayload.sub)
      }
    });

    return this.setResponse(request, response, user);

    // TODO: update refresh auth

    // if ((request.user as any).id === Number(jwtDecodedPayload.sub)) {
    //   const token: Token = await this.prismaService.token.delete({
    //     where: {
    //       id: Number(jwtDecodedPayload.jti)
    //     }
    //   });
    //
    //   if (!token) {
    //     throw new UnprocessableEntityException('Refresh token not found');
    //   }
    // }
    //
    // return this.setResponse(request.user as any, response);
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

    return this.setRedirect(user, response, socialKey);
  }

  /** SHARED METHODS */

  async setResponse(request: Request, response: Response, user: User): Promise<User> {
    /** REMOVE SENSITIVE DATA */

    const { select } = this.prismaService.setNonSensitiveUserSelect();

    for (const column in select) {
      !select[column] && delete user[column];
    }

    /** TOKEN ISSUE */

    // prettier-ignore
    const refresh: string = await this[request.signedCookies.refresh ? 'upsertRefresh' : 'createRefresh'](request, user);
    const access: string = await this.createAccess(request, user);

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

  async setRedirect(user: User, response: Response, socialKey: string): Promise<void> {
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

  /** TOKEN METHODS */

  async createAccess(request: Request, user: User): Promise<string> {
    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_ACCESS_TTL),
      subject: String(user.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async createRefresh(request: Request, user: User): Promise<string> {
    const token: Token = await this.prismaService.token.create({
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

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }

  async upsertRefresh(request: Request, user: User): Promise<string> {
    // prettier-ignore
    const jwtDecodedPayload: JwtDecodedPayload = await this.jwtService.verifyAsync(request.signedCookies.refresh);

    const payload: any = {
      ua: request.headers['user-agent'],
      fingerprint: request.body.fingerprint,
      ip: request.ip,
      user: {
        connect: {
          id: user.id
        }
      }
    };

    const token: Token = await this.prismaService.token.upsert({
      where: {
        id: Number(jwtDecodedPayload.jti)
      },
      update: payload,
      create: payload
    });

    const signOptions: SignOptions = {
      ...this.signOptions,
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, signOptions);
  }
}
