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
import { CreateDto } from '../users/users.dto';
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
    const user: User = await this.usersRepository.getByEmail(loginDto);

    if (!user) {
      throw new NotFoundException();
    }

    const userCredentials = await this.usersRepository.getCredentials(user);

    if ('password' in loginDto) {
      const passwordIsValid: boolean = await compare(loginDto.password, userCredentials.password);

      if (passwordIsValid) {
        return await this.getSharedResponse(user, response);
      }
    }

    if ('googleId' in loginDto) {
      const googleIdIsValid: boolean = loginDto.googleId === userCredentials.googleId;

      if (googleIdIsValid) {
        return await this.getSharedResponse(user, response);
      }
    }

    if ('facebookId' in loginDto) {
      const facebookIdIsValid: boolean = loginDto.facebookId === userCredentials.facebookId;

      if (facebookIdIsValid) {
        return await this.getSharedResponse(user, response);
      }
    }

    throw new UnauthorizedException();
  }

  async refresh(request: Request, response: Response): Promise<User> {
    const refreshToken: string = request.signedCookies.refreshToken;

    if (!refreshToken) {
      throw new ForbiddenException();
    }

    const user: User = await this.tokensService.resolveRefreshToken(refreshToken);

    if (!user) {
      throw new ForbiddenException();
    }

    return await this.getSharedResponse(user, response);
  }

  async getSocial(request: Request, response: Response, socialKey: string): Promise<void> {
    const createDto: CreateDto = request.user as CreateDto;

    if (!createDto) {
      throw new UnauthorizedException();
    }

    const userExist: User = await this.usersRepository.getByEmail(createDto);

    if (userExist) {
      const user: User = { ...userExist, [socialKey]: createDto[socialKey] };

      return await this.getSharedRedirect(user, response, socialKey);
    }

    const userCreated: User = await this.usersRepository.create(createDto);

    return await this.getSharedRedirect(userCreated, response, socialKey);
  }

  async getSharedResponse(user: User, response: Response): Promise<User> {
    const refreshToken: string = await this.tokensService.generateRefreshToken(user);

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

  async getSharedRedirect(user: User, response: Response, socialKey: string): Promise<void> {
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
