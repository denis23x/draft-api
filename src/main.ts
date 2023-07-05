/** @format */

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  TransformInterceptor,
  PrismaExceptionFilter,
  AllExceptionsFilter,
  PrismaService
} from './app/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import swaggerStats from 'swagger-stats';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const bootstrap = async () => {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  const logger: Logger = app.get(Logger);
  const reflector: Reflector = app.get(Reflector);
  const configService: ConfigService = app.get(ConfigService);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);
  const prismaService: PrismaService = app.get(PrismaService);

  /** https://docs.nestjs.com/recipes/prisma#issues-with-enableshutdownhooks */

  prismaService.enableShutdownHooks(app).then(() => {
    logger.log('Prisma enableShutdownHooks');
  });

  /** SETTINGS */

  app.setGlobalPrefix(configService.get('APP_PREFIX'), {
    exclude: ['swagger']
  });

  /** LOGGER */

  app.useLogger(logger);

  /** FILTERS */

  app.useGlobalFilters(
    new AllExceptionsFilter(configService, httpAdapterHost),
    new PrismaExceptionFilter(configService)
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
    origin: [configService.get('APP_SITE_ORIGIN'), ...configService.get('APP_SITE_CORS').split(',')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
  });

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

  app.use(cookieParser(configService.get('APP_COOKIE_SECRET')));
  app.use(compression());

  /** SWAGGER */

  const swaggerDescription: string = readFileSync('src/assets/md/swagger-ui.md', 'utf8');
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
    onAuthenticate: (request, username, password) => username === configService.get('SWAGGER_STATS_USER') && password === configService.get('SWAGGER_STATS_PASSWORD')
  }));

  /** https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/ */

  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
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

  /** LISTEN */

  app.listen(Number(configService.get('APP_PORT'))).then(() => {
    logger.log('Server is listening on http://localhost:3323/swagger/docs');
  });
};

bootstrap().then(() => console.debug('OK'));
