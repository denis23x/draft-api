/** @format */

import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TransformInterceptor, PrismaExceptionFilter, WinstonService } from './app/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { OpenAPIObject } from '@nestjs/swagger/dist/interfaces';
import { readFileSync } from 'fs';
import helmet from 'helmet';

const bootstrap = async () => {
  const globalPrefix = process.env.APP_PREFIX;
  const port = Number(process.env.APP_PORT);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new WinstonService(),
    cors: {
      // prettier-ignore
      origin: [process.env.APP_SITE_ORIGIN, /\.ngrok\.io$/].concat(process.env.APP_SITE_CORS.split(',')),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    }
  });

  app.setGlobalPrefix(globalPrefix);

  /** FILTERS */

  app.useGlobalFilters(new PrismaExceptionFilter());

  /** INTERCEPTORS */

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new TransformInterceptor());

  /** MISC */

  app.use(
    helmet({
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
    })
  );

  app.useStaticAssets('src/assets');
  app.useStaticAssets('upload');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: {
        target: false
      }
    })
  );

  app.use(cookieParser(process.env.APP_COOKIE_SECRET));
  app.use(compression());

  try {
    const description: string = readFileSync('src/assets/md/swagger-ui.md', 'utf8');

    const config = new DocumentBuilder()
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

    const openAPIObject: OpenAPIObject = SwaggerModule.createDocument(app, config);

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
    Logger.error("Can't start Swagger UI", error);
  }

  await app.listen(port, () => Logger.log('http://localhost:' + port + '/docs'));
};

bootstrap().then(() => Logger.log('OK'));
