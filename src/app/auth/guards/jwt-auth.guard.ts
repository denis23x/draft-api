/** @format */

import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContextHost) {
    const asd = context.getArgByIndex(0);

    // const httpArgumentsHost: HttpArgumentsHost = asd.switchToHttp();
    //
    // const response: Response = httpArgumentsHost.getResponse<Response>();
    // const request: Request = httpArgumentsHost.getRequest<Request>();

    console.log(asd.headers);

    // console.log(asd.url);

    // if (asd.url === '/api/auth/refresh') {
    //   return true;
    // }

    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('handleRequest', err, user, info);

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    return user;
  }
}
