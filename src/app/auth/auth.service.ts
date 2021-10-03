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
import { CreateUserDto } from '../users/users.dto';
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
    const isExist = await this.usersRepository.findOneByEmail(loginDto.email);

    if (!isExist) {
      throw new NotFoundException();
    }

    const existCredentials = await this.usersRepository.findOneCredentials(isExist.id);

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
    const refreshToken = request.signedCookies['refreshToken'];

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
    const createUserDto = request['user'] as CreateUserDto;

    if (!createUserDto) {
      throw new UnauthorizedException();
    }

    const isExist = await this.usersRepository.findOneByEmail(createUserDto.email);

    if (isExist) {
      const exist = { ...isExist, [socialId]: createUserDto[socialId] };

      return this.getSharedRedirect(exist, response, socialId);
    }

    const user = await this.usersRepository.create(createUserDto);

    return this.getSharedRedirect(user, response, socialId);
  }

  async getSharedResponse(user: User, response: Response): Promise<User> {
    const refreshToken = await this.tokensService.generateRefreshToken(user);

    // TODO: enable secure and sameSite (need HTTPS)
    response.cookie('refreshToken', refreshToken, {
      domain: process.env.APP_COOKIE_DOMAIN,
      path: '/api/auth/refresh',
      signed: true,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TTL)
      // secure: true,
      // sameSite: 'none'
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
