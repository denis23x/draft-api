/** @format */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';

@Catch(QueryFailedError, EntityNotFoundError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: any, argumentsHost: ArgumentsHost) {
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    if (exception instanceof TypeORMError) {
      const error: string = exception.message.split(':').shift();

      switch (error) {
        case 'ER_DUP_ENTRY': {
          const statusCode = 400;
          const message: string = exception.message
            .match(/'(.*?)'/g)
            .shift()
            .replace(/'/g, ' ')
            .concat('already exist!')
            .trim();

          return response.status(statusCode).json({
            statusCode,
            message
          });
        }
      }
    }
  }
}
