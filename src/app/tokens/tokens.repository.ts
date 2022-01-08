/** @format */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Token } from './tokens.entity';
import { JwtDecodedPayload } from '../auth/auth.interface';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>
  ) {}

  async create(user: User): Promise<Token> {
    const token: Token = new Token();
    const date: Date = new Date();

    token.userId = user.id;
    token.expires = new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL)));

    return await this.tokensRepository.save(token);
  }

  async delete(jwtDecodedPayload: JwtDecodedPayload): Promise<DeleteResult> {
    return await this.tokensRepository.delete(jwtDecodedPayload.jti);
  }
}
