/** @format */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  catch(exception: any, argumentsHost: ArgumentsHost): void {
    const httpAdapterHost: AbstractHttpAdapter = this.httpAdapterHost.httpAdapter;
    const httpArgumentsHost: HttpArgumentsHost = argumentsHost.switchToHttp();

    const response: Response = httpArgumentsHost.getResponse<Response>();
    const request: Request = httpArgumentsHost.getRequest<Request>();

    const getBody = (): any => {
      /** JSON WEB TOKEN EXCEPTION */

      if (exception instanceof JsonWebTokenError) {
        return {
          statusCode: 400,
          message: exception.message
        };
      }

      /** ANY HTTP EXCEPTION */

      if (exception instanceof HttpException) {
        return exception.getResponse();
      }

      /** REST EXCEPTION */

      return {
        statusCode: 500,
        message: 'Internal Server Error'
      };
    };

    const body: any = getBody();
    const statusCode: number = body.statusCode;

    httpAdapterHost.reply(response, body, statusCode);
  }
}
