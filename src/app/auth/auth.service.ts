/** @format */

import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { Request, Response } from 'express';
import { User } from '../users/users.entity';
import { LoginDto } from './auth.dto';
import { CreateDto, FindOneByIdDto } from '../users/users.dto';
import { UsersRepository } from '../users/users.repository';
import { TokensService } from '../tokens/tokens.service';
import * as url from 'url';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly tokensService: TokensService
  ) {}

  async login(loginDto: LoginDto, response: Response): Promise<User> {
    const isExist = await this.usersRepository.findOneByEmail(loginDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    const existCredentials = await this.usersRepository.findOneByIdCredentials(
      isExist as FindOneByIdDto
    );

    if (loginDto.password) {
      const isValid = await compare(loginDto.password, existCredentials.password);

      if (isValid) {
        return this.getSharedResponse(isExist, response);
      }
    }

    const isGoogle = loginDto.googleId && loginDto.googleId === existCredentials.googleId;
    const isFacebook = loginDto.facebookId && loginDto.facebookId === existCredentials.facebookId;

    if (isGoogle || isFacebook) {
      return this.getSharedResponse(isExist, response);
    }

    throw new UnauthorizedException();
  }

  async refresh(request: Request, response: Response): Promise<User> {
    const refreshToken = request.signedCookies.refreshToken;

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const isExist = await this.tokensService.resolveRefreshToken(refreshToken);

    if (!isExist) {
      throw new ForbiddenException();
    }

    return this.getSharedResponse(isExist, response);
  }

  async social(request: Request, response: Response, socialId: string): Promise<void> {
    const createDto = request.user as CreateDto;

    if (!createDto) {
      throw new UnauthorizedException();
    }

    const isExist = await this.usersRepository.findOneByEmail(createDto);

    if (isExist) {
      const exist = { ...isExist, [socialId]: createDto[socialId] };

      return this.getSharedRedirect(exist, response, socialId);
    }

    const user = await this.usersRepository.create(createDto);

    return this.getSharedRedirect(user, response, socialId);
  }

  async getSharedResponse(user: User, response: Response): Promise<User> {
    const refreshToken = await this.tokensService.generateRefreshToken(user);

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

    return Object.assign(user, {
      accessToken: await this.tokensService.generateAccessToken(user)
    });
  }

  async getSharedRedirect(user: User, response: Response, socialId: string): Promise<void> {
    response.redirect(
      url.format({
        pathname: process.env.APP_SITE_ORIGIN + '/auth/login',
        query: {
          email: user.email,
          [socialId]: user[socialId]
        }
      })
    );
  }
}
