/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { PrismaService } from '../../core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  async validate(request: Request): Promise<any> {
    console.log(request.headers.authorization);
    console.log(this.jwtService.decode(request.headers.authorization.replace('Bearer ', '')));

    throw new UnauthorizedException();

    return new Promise(resolve => {
      resolve({
        denis: 'asd'
      });
    });
  }
}
