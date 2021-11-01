/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { User } from '../../users/users.entity';
import { IdentifierDto } from '../../core';
import { GetOneDto } from '../../users/users.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    });
  }

  async validate(payload): Promise<User> {
    const identifierDto: IdentifierDto = {
      id: Number(payload.sub)
    };

    return this.usersRepository.getOneById(identifierDto, {} as GetOneDto);
  }
}
