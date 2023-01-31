/** @format */

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    const response: Response = executionContext.switchToHttp().getResponse<Response>();

    return callHandler.handle().pipe(
      map((data: any) => {
        return {
          data,
          statusCode: response.statusCode
        };
      })
    );
  }
}
