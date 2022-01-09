/** @format */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const request: any = httpArgumentsHost.getRequest();
    const response: any = httpArgumentsHost.getResponse();

    return callHandler.handle().pipe(
      map((data: any) => ({
        data,
        statusCode: response.statusCode
      }))
    );
  }
}
