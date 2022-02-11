/** @format */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Prisma } from '@prisma/client';

export interface ErrorBody {
  statusCode: number;
  message: string;
}

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: any, argumentsHost: ArgumentsHost) {
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();

    /** https://www.prisma.io/docs/reference/api-reference/error-reference */
    /** https://developer.mozilla.org/ru/docs/Web/HTTP/Status */

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const getErrorBody = (): ErrorBody => {
        switch (exception.code) {
          case 'P2001': {
            return {
              statusCode: 404,
              message: 'Not found'
            };
          }
          case 'P2002': {
            return {
              statusCode: 422,
              message: 'Already exist'
            };
          }
          default: {
            return {
              statusCode: 400,
              message: 'Bad Request'
            };
          }
        }
      };

      const errorBody: ErrorBody = getErrorBody();

      return response.status(errorBody.statusCode).json({
        statusCode: errorBody.statusCode,
        message: errorBody.message
      });
    }
  }
}
