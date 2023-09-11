/** @format */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile
} from '@nestjs/common';
import { filter, map, Observable } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(executionContext: ExecutionContext, callHandler: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const request: Request = executionContext.switchToHttp().getRequest<Request>();
    const response: Response = executionContext.switchToHttp().getResponse<Response>();

    return callHandler.handle().pipe(
      filter((data: any) => !(data instanceof StreamableFile)),
      map((data: any) => ({
        data,
        statusCode: response.statusCode
      }))
    );
  }
}
