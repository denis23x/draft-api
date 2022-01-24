/** @format */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

const bootstrap = async () => {
  const globalPrefix = process.env.APP_PREFIX || '';
  const port = Number(process.env.APP_PORT);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [process.env.APP_SITE_ORIGIN].concat(process.env.APP_SITE_ORIGIN_CORS.split(',')),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true
    }
  });

  app.useStaticAssets('src/assets');
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      validationError: {
        target: false
      }
    })
  );

  app.use(cookieParser(process.env.APP_COOKIE_SECRET));
  app.use(compression());

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
};

bootstrap();
