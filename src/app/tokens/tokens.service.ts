/** @format */

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../users/users.entity';
import { TokensRepository } from './tokens.repository';
import { UsersRepository } from '../users/users.repository';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { IdDto } from '../core';
import { Token } from './tokens.entity';
import { DeleteResult } from 'typeorm';
import { GetOneDto } from '../users/users.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async generateAccessToken(user: User): Promise<string> {
    const signOptions: SignOptions = {
      ...this.getJwtBaseOptions(),
      subject: String(user.id)
    };

    return await this.jwtService.signAsync({}, signOptions);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token: Token = await this.tokensRepository.create(user);

    const signOptions: SignOptions = {
      ...this.getJwtBaseOptions(),
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return await this.jwtService.signAsync({}, signOptions);
  }

  async resolveRefreshToken(refreshToken: string): Promise<User> {
    const jwtDecodedPayload: JwtDecodedPayload = await this.decodeRefreshToken(refreshToken);

    const deleteResult: DeleteResult = await this.tokensRepository.delete(jwtDecodedPayload);

    if (!deleteResult) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const idDto: IdDto = {
      id: Number(jwtDecodedPayload.sub)
    };

    const getOneDto: GetOneDto = {
      scope: ['categories']
    };

    return await this.usersRepository.getOne(idDto, getOneDto);
  }

  async decodeRefreshToken(token: string): Promise<JwtDecodedPayload> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }

  getJwtBaseOptions(): SignOptions {
    return {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    };
  }
}
