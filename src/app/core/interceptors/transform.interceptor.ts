/** @format */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable, of, switchMap } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();

    return callHandler.handle().pipe(
      switchMap((data: any) => {
        return of({
          data,
          statusCode: response.statusCode
        });
      })
    );
  }
}
