/** @format */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { Token } from './tokens.entity';

@Injectable()
export class TokensRepository {
  constructor(
    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>
  ) {}

  async create(user: User): Promise<Token> {
    const token = new Token();
    const date = new Date();

    token.userId = user.id;
    token.expires = new Date(date.setTime(date.getTime() + Number(process.env.JWT_REFRESH_TTL)));

    return this.tokensRepository.save(token);
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.tokensRepository.delete(id);
  }
}
