/** @format */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: any, argumentsHost: ArgumentsHost): Response {
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();

    /** https://www.prisma.io/docs/reference/api-reference/error-reference */
    /** https://developer.mozilla.org/ru/docs/Web/HTTP/Status */

    switch (exception.code) {
      case 'P2001':
      case 'P2025': {
        return response.status(404).json({
          statusCode: 404,
          message: 'Not found'
        });
      }
      case 'P2002': {
        return response.status(422).json({
          statusCode: 422,
          message: 'Already exists'
        });
      }
      default: {
        return response.status(400).json({
          statusCode: 400,
          message: 'Bad Request'
        });
      }
    }
  }
}
