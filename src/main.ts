/** @format */

import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor, PrismaExceptionFilter, AllExceptionsFilter } from './app/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { readFileSync } from 'fs';
import { ConfigService } from '@nestjs/config';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import compression from 'compression';

let pinoLogger: Logger;

const bootstrap = async () => {
  const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true
  });

  const logger: Logger = app.get(Logger);
  const reflector: Reflector = app.get(Reflector);
  const configService: ConfigService = app.get(ConfigService);
  const httpAdapterHost: HttpAdapterHost = app.get(HttpAdapterHost);

  pinoLogger = logger;

  /** SETTINGS */

  app.setGlobalPrefix(configService.get('APP_PREFIX'));

  /** LOGGER */

  app.useLogger(app.get(Logger));

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
    origin: [configService.get('APP_SITE_ORIGIN')].concat(configService.get('APP_SITE_CORS').split(','), /\.ngrok\.io$/),
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
    },
    expectCt: false
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

  try {
    const description: string = readFileSync('src/assets/md/swagger-ui.md', 'utf8');

    const openAPIConfig: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle('Swagger UI')
      .setDescription(description)
      .setVersion('0.1')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        'access'
      )
      .build();

    const openAPIObject: OpenAPIObject = SwaggerModule.createDocument(app, openAPIConfig);

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

    SwaggerModule.setup('docs', app, openAPIObject, swaggerCustomOptions);
  } catch (error: any) {
    logger.error("Can't start Swagger UI", error);
  }

  await app.listen(Number(configService.get('APP_PORT')));
};

bootstrap().then(() => pinoLogger.log('Server is listening on http://localhost:3323/docs'));
