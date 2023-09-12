/** @format */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request: Request = executionContext.switchToHttp().getRequest<Request>();
    const response: Response = executionContext.switchToHttp().getResponse<Response>();

    return callHandler.handle().pipe(
      map((data: any): any => {
        if (data instanceof StreamableFile) {
          return data;
        } else {
          return {
            data,
            statusCode: response.statusCode
          };
        }
      })
    );
  }
}
