/** @format */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomStrategy extends PassportStrategy(Strategy, 'custom') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async validate(request: Request, callback: any): Promise<void> {
    const authorization: string | undefined = request.headers.authorization;

    if (authorization) {
      try {
        const jwtSignOptions: any = await this.jwtService.verifyAsync(authorization.slice(7));

        callback(null, { id: Number(jwtSignOptions.sub) });
      } catch (error: any) {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
