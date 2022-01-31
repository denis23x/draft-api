/** @format */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    /** Wrap response in data object */

    return callHandler.handle().pipe(
      map((data: any) => ({
        data,
        statusCode: response.statusCode
      }))
    );
  }
}
