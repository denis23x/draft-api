/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { User } from '../../users/users.entity';
import { IdDto } from '../../core';
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
    const idDto: IdDto = {
      id: Number(payload.sub)
    };

    const getOneDto: GetOneDto = {
      scope: ['categories']
    };

    return this.usersRepository.getOne(idDto, getOneDto);
  }
}
