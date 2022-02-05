/** @format */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Observable, of, switchMap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    return callHandler.handle().pipe(
      switchMap((data: any) => {
        /**
         * Avoid Swagger UI
         */

        const swaggerUI: boolean = request.headers.referer === process.env.APP_ORIGIN + '/docs/';

        return of(
          swaggerUI
            ? data
            : {
                data,
                statusCode: response.statusCode
              }
        );
      })
    );
  }
}
