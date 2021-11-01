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

    return await this.jwtService.signAsync({}, opts);
  }

  async generateRefreshToken(user: User): Promise<string> {
    const token = await this.tokensRepository.createOne(user);

    const opts: SignOptions = {
      ...this.getJwtBaseOptions(),
      expiresIn: Number(process.env.JWT_REFRESH_TTL),
      subject: String(user.id),
      jwtid: String(token.id)
    };

    return await this.jwtService.signAsync({}, opts);
  }

  async resolveRefreshToken(refreshToken: string): Promise<User> {
    const payload = await this.decodeRefreshToken(refreshToken);

    const jtiIdentifierDto: IdentifierDto = {
      id: Number(payload.jti)
    };

    const isDelete = await this.tokensRepository.deleteOne(jtiIdentifierDto);

    if (!isDelete) {
      throw new UnprocessableEntityException('Refresh token not found');
    }

    const subIdentifierDto: IdentifierDto = {
      id: Number(payload.sub)
    };

    return await this.usersRepository.getOneById(subIdentifierDto);
  }

  private getJwtBaseOptions(): SignOptions {
    return {
      issuer: process.env.JWT_ISSUER,
      audience: process.env.JWT_AUDIENCE
    };
  }

  private async decodeRefreshToken(token: string): Promise<JwtDecodedPayload> {
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
}
