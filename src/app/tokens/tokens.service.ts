/** @format */

import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { User } from '../users/users.entity';
import { TokensRepository } from './tokens.repository';
import { UsersRepository } from '../users/users.repository';
import { JwtDecodedPayload } from '../auth/auth.interface';
import { IdentifierDto } from '../core';

@Injectable()
export class TokensService {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async generateAccessToken(user: User): Promise<string> {
    const opts: SignOptions = {
      ...this.getJwtBaseOptions(),
      subject: String(user.id)
    };

    return this.jwtService.signAsync({}, opts);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token = await this.tokensRepository.create(user);

    const opts: SignOptions = {
      ...this.getJwtBaseOptions(),
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return this.jwtService.signAsync({}, opts);
  }

  async resolveRefreshToken(refreshToken: string): Promise<User> {
    const payload = await this.decodeRefreshToken(refreshToken);

    const isDelete = await this.tokensRepository.delete(Number(payload.jti));

    if (!isDelete) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const identifierDto: IdentifierDto = {
      id: Number(payload.sub)
    };

    return this.usersRepository.getOneById(identifierDto);
  }

  private getJwtBaseOptions(): SignOptions {
    return {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    };
  }

  private async decodeRefreshToken(token: string): Promise<JwtDecodedPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException('Refresh token expired');
      } else {
        throw new UnprocessableEntityException('Refresh token malformed');
      }
    }
  }
}
