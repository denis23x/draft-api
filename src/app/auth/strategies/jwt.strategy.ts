/** @format */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../users/users.repository';
import { User } from '../../users/users.entity';

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
    return this.usersRepository.findOneById(Number(payload.sub));
  }
}
