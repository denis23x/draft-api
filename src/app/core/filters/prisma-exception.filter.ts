/** @format */

import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { Response } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Prisma } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ConfigService } from '@nestjs/config';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
    private readonly configService: ConfigService
  ) {}

  catch(exception: any, argumentsHost: ArgumentsHost): Response {
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    /** LOGGER */

    const searchParams: URLSearchParams = new URLSearchParams(request.url.split('?')[1]);
    const queryParams: string[] = searchParams
      .toString()
      .split('&')
      .filter((param: string) => !!param);

    const message: string = `${exception.message}: ${request.method} ${request.url}`;

    this.logger.error(message, {
      request: {
        jwt: (request as any).user,
        body: Object.keys(request.body).length ? request.body : undefined,
        method: request.method,
        queryParams: queryParams.length ? queryParams : undefined,
        headers: {
          ...request.headers,
          authorization: undefined
        }
      },
      ...exception
    });

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
