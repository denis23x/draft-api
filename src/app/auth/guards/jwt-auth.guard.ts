/** @format */

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(executionContext: ExecutionContext) {
    // const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();
    //
    // const request: Request = httpArgumentsHost.getRequest<Request>();
    // const response: Response = httpArgumentsHost.getResponse<Response>();
    //
    // console.log('request.headers.authorization = ', request.headers.authorization);
    // console.log('request.signedCookies.refreshToken = ', request.signedCookies.refreshToken);
    //
    // const asd = new JwtService({
    //   secret: process.env.JWT_SECRET
    // });
    //
    // asd.verifyAsync(request.headers.authorization.replace('Bearer ', '')).then(res => {
    //   console.log(res);
    // });
    //
    // asd.verifyAsync(request.signedCookies.refreshToken).then(res => {
    //   console.log(res);
    // });

    // console.log(asd.url);

    // if (asd.url === '/api/auth/refresh') {
    //   return true;
    // }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return true;
  }

  async validate(username: string, password: string): Promise<any> {
    console.log('validate');

    return false;
  }

  handleRequest(err, user, info) {
    console.log('handleRequest', err, user, info);

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
