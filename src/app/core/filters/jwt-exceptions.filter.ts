/** @format */

import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JwtExceptionsFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(JsonWebTokenError.name);

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

    /** https://github.com/auth0/node-jsonwebtoken#errors--codes */

    switch (exception.name) {
      case 'TokenExpiredError': {
        return response.status(400).json({
          statusCode: 400,
          message: exception.message
        });
      }
      case 'JsonWebTokenError': {
        return response.status(422).json({
          statusCode: 422,
          message: exception.message
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
