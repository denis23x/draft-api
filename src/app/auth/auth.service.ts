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
import { CreateDto, GetAllDto, GetOneDto } from '../users/users.dto';
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
    const getAllDto: GetAllDto = {
      email: loginDto.email,
      exact: 1
    };

    const user: User[] = await this.usersRepository.getAll(getAllDto);

    if (!user.length) {
      throw new NotFoundException();
    }

    const userExist: User = user.shift();

    const getOneDto: GetOneDto = {
      scope: ['categories']
    };

    const userCredentials: User = await this.usersRepository.getOne(userExist, getOneDto, true);

    if ('password' in loginDto) {
      const password: boolean = await compare(loginDto.password, userCredentials.password);

      if (password) {
        return await this.setResponse(userCredentials, response);
      }
    }

    if ('googleId' in loginDto) {
      if (loginDto.googleId === userCredentials.googleId) {
        return await this.setResponse(userCredentials, response);
      }
    }

    if ('facebookId' in loginDto) {
      if (loginDto.facebookId === userCredentials.facebookId) {
        return await this.setResponse(userCredentials, response);
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

    return await this.setResponse(user, response);
  }

  async getMe(request: Request): Promise<User> {
    const user: User = request.user as User;

    const getOneDto: GetOneDto = {
      scope: ['categories']
    };

    const userExist: User = await this.usersRepository.getOne(user, getOneDto);

    if (!userExist) {
      throw new NotFoundException();
    }

    return userExist;
  }

  async getSocial(request: Request, response: Response, socialKey: string): Promise<void> {
    const createDto: CreateDto = request.user as CreateDto;

    if (!createDto) {
      throw new UnauthorizedException();
    }

    const getAllDto: GetAllDto = {
      email: createDto.email,
      exact: 1
    };

    const user: User[] = await this.usersRepository.getAll(getAllDto);
    const userExist: User = user.shift();

    if (!!userExist) {
      const user: User = {
        ...userExist,
        email: createDto.email,
        [socialKey]: createDto[socialKey]
      };

      return await this.setRedirect(user, response, socialKey);
    }

    const userCreated: User = await this.usersRepository.create(createDto);

    return await this.setRedirect(userCreated, response, socialKey);
  }

  async setResponse(user: User, response: Response): Promise<User> {
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

    delete user.password;
    delete user.googleId;
    delete user.facebookId;

    return Object.assign(user, {
      accessToken: await this.tokensService.generateAccessToken(user)
    });
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
