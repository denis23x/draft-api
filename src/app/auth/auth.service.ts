/** @format */

import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { Request, Response } from 'express';
import { LoginDto, RegistrationDto } from './dto';
import { TokenService } from '../token/token.service';
import * as url from 'url';
import { Token, User } from '@prisma/client';
import { PrismaService } from '../core';
import { JwtDecodedPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}

  async login(request: Request, response: Response, loginDto: LoginDto): Promise<User> {
    // TODO: add categories

    const user: User = await this.prismaService.user.findUnique({
      where: {
        email: loginDto.email
      }
    });

    if (!user) {
      throw new NotFoundException();
    }

    if (loginDto.hasOwnProperty('password')) {
      const password: boolean = await compare(loginDto.password, user.password);

      if (password) {
        return this.setResponse(user, response);
      }
    }

    if (loginDto.hasOwnProperty('googleId')) {
      if (loginDto.googleId === user.googleId) {
        return this.setResponse(user, response);
      }
    }

    if (loginDto.hasOwnProperty('facebookId')) {
      if (loginDto.facebookId === user.facebookId) {
        return this.setResponse(user, response);
      }
    }

    throw new UnauthorizedException();
  }

  // prettier-ignore
  async registration(request: Request, response: Response, registrationDto: RegistrationDto): Promise<User> {
    if (registrationDto.hasOwnProperty('password')) {
      registrationDto.password = await hash(registrationDto.password, 10);
    }

    // @ts-ignore
    const user: User = await this.prismaService.user.create({
      ...this.prismaService.setNonSensitiveUserSelect(),
      data: registrationDto
    });

    return this.setResponse(user, response);
  }

  async refresh(request: Request, response: Response): Promise<User> {
    const refreshToken: string = request.signedCookies.refreshToken;

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const jwtDecodedPayload: JwtDecodedPayload = await this.tokenService.decodeRefreshToken(
      refreshToken
    );

    // TODO: update refresh auth

    const user: User = await this.prismaService.user.findUnique({
      where: {
        id: Number(jwtDecodedPayload.sub)
      }
    });

    return this.setResponse(user, response);

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

    const user: User = await this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id: (request.user as any).id
      }
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async getSocial(request: Request, response: Response, socialKey: string): Promise<void> {
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

  async setResponse(user: User, response: Response): Promise<User> {
    const { select } = this.prismaService.setNonSensitiveUserSelect();

    for (const column in select) {
      !select[column] && delete user[column];
    }

    const refreshToken: string = await this.tokenService.generateRefreshToken(user.id);
    const accessToken: string = await this.tokenService.generateAccessToken(user.id);

    // TODO: enable secure and sameSite (need HTTPS)
    // secure: true,
    // sameSite: 'none'

    response.cookie('refreshToken', refreshToken, {
      domain: process.env.APP_COOKIE_DOMAIN,
      path: '/api/auth/refresh',
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
}
