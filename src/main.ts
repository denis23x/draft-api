/** @format */

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor, PrismaExceptionFilter, JwtExceptionsFilter } from './app/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerStats from 'swagger-stats';
import { join } from 'path';
import express, { Express } from 'express';
import { HttpsFunction, onRequest } from 'firebase-functions/v2/https';
import process from 'process';

const bootstrap = async (expressServer: Express): Promise<NestExpressApplication> => {
  // prettier-ignore
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressServer), {
    bufferLogs: true
  });

  const logger: Logger = app.get(Logger);
  const reflector: Reflector = app.get(Reflector);
  const configService: ConfigService = app.get(ConfigService);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);

  /** https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-5#removal-of-the-beforeexit-hook-from-the-library-engine */

  app.enableShutdownHooks();

  /** SETTINGS */

  app.setGlobalPrefix(configService.get('APP_PREFIX'), {
    exclude: ['swagger']
  });

  /** LOGGER */

  app.useLogger(logger);

  /** FILTERS */

  app.useGlobalFilters(
    new JwtExceptionsFilter(configService, httpAdapterHost),
    new PrismaExceptionFilter(configService, httpAdapterHost)
  );

  /** INTERCEPTORS */

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new TransformInterceptor(),
    new LoggerErrorInterceptor()
  );

  /** CORS */

  app.enableCors({
    // prettier-ignore
    origin: [configService.get('APP_ORIGIN_FRONTEND'), ...configService.get('APP_ORIGIN_CORS').split(',')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });

  /** ASSETS */

  app.useStaticAssets('src/assets');
  app.useStaticAssets('upload');

  /** PIPES */

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: {
        target: false
      }
    })
  );

  /** MISC */

  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.use(compression());

  /** SWAGGER */

  // prettier-ignore
  const swaggerDescription: string = readFileSync(join(__dirname, 'assets/markdown/swagger-readme.md'), 'utf8');
  const swaggerBearer: SecuritySchemeObject = {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  };

  const openAPIConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Swagger UI')
    .setDescription(swaggerDescription)
    .setVersion(configService.get('APP_VERSION'))
    .addBearerAuth(swaggerBearer, 'access')
    .addServer(configService.get('APP_ORIGIN'))
    .build();

  const openAPIObject: OpenAPIObject = SwaggerModule.createDocument(app, openAPIConfig);

  /** https://swaggerstats.io/guide/conf.html */

  // prettier-ignore
  app.use(swaggerStats.getMiddleware({
    name: 'Swagger Stats',
    version: configService.get('APP_VERSION'),
    uriPath: '/swagger/stats',
    swaggerSpec: openAPIObject,
    authentication: true,
    onAuthenticate: (request, username: string, password: string) => {
      return username === configService.get('SWAGGER_STATS_USER') && password === configService.get('SWAGGER_STATS_PASSWORD');
    }
  }));

  /** https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/ */

  const swaggerCustomOptions: SwaggerCustomOptions = {
    explorer: true,
    swaggerOptions: {
      urls: [
        {
          url: configService.get('APP_ORIGIN') + '/swagger/docs-json',
          name: 'Draft API'
        }
      ],
      filter: true,
      persistAuthorization: true,
      docExpansion: 'none',
      showExtensions: true,
      showCommonExtensions: true,
      defaultModelsExpandDepth: -1,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      },
      operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
    }
  };

  SwaggerModule.setup('/swagger/docs', app, openAPIObject, swaggerCustomOptions);

  /** SECURITY */

  // prettier-ignore
  app.use(helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'https: data: blob:']
      }
    }
  }));

  return app;
};

const expressServer: Express = express();

bootstrap(expressServer)
  .then(app => {
    if (process.env.APP_STAGE === 'production') {
      app.init().then(() => {
        console.log('Nest Cloud Ready');
      });
    }

    if (process.env.APP_STAGE === 'development') {
      app.listen(Number(process.env.APP_PORT)).then(() => {
        // prettier-ignore
        console.log('Server is listening on http://localhost:' + process.env.APP_PORT + '/swagger/docs');
      });
    }
  })
  .catch((error: any) => console.error('Nest broken', error));

export const api: HttpsFunction = onRequest(expressServer);
