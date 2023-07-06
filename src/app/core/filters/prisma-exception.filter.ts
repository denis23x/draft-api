/** @format */

import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(PrismaExceptionFilter.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  catch(exception: any, argumentsHost: ArgumentsHost): Response {
    const httpAdapterHost: AbstractHttpAdapter = this.httpAdapterHost.httpAdapter;
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    /** LOGGER */

    this.logger.error(exception.message);

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
        return response.status(500).json({
          statusCode: 500,
          message: 'Internal Server Error'
        });
      }
    }
  }
}
