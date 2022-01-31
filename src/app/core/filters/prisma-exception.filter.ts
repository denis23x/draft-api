/** @format */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
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
    const request: Request = httpArgumentsHost.getRequest<Request>();

    /** https://developer.mozilla.org/ru/docs/Web/HTTP/Status */

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const getErrorBody = (): ErrorBody => {
        const statusCode = 400;

        switch (exception.code) {
          case 'P2002': {
            switch (request.url) {
              case '/api/users': {
                return {
                  statusCode,
                  message: 'User already exists'
                };
              }
              default: {
                return {
                  statusCode,
                  message: 'Already exists'
                };
              }
            }
          }
          default: {
            return {
              statusCode,
              message: 'Already exists'
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
