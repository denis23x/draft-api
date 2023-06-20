/** @format */

import { Module, Global, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CoreModule } from './core';
import { FileModule } from './file/file.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UtilitiesModule } from './utilities/utilities.module';
import { PasswordModule } from './password/password.module';
import { EmailModule } from './email/email.module';
import { join } from 'path';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: true,
      expandVariables: true
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: Number(configService.get('MAILER_PORT')),
          secure: false,
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASSWORD')
          }
        },
        defaults: {
          from: 'Draft website'
        },
        template: {
          dir: join(__dirname, '../../templates/emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true
          }
        },
        options: {
          partials: {
            dir: join(__dirname, '../../templates/emails/partials'),
            options: {
              strict: true
            }
          }
        }
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        ttl: Number(configService.get('APP_CACHE_TTL')),
        max: Number(configService.get('APP_CACHE_MAX'))
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    ThrottlerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        ttl: Number(configService.get('APP_THROTTLER_TTL')),
        limit: Number(configService.get('APP_THROTTLER_LIMIT'))
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.metadata({
            fillExcept: ['message', 'level', 'timestamp', 'metadata']
          }),
          winston.format.json({
            space: 2,
            maximumBreadth: 10,
            maximumDepth: 10
          })
        ),
        transports: [
          new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
              winston.format.colorize({
                level: true,
                message: true
              }),
              winston.format.printf((transformableInfo: winston.Logform.TransformableInfo) => {
                const { timestamp, level, message } = transformableInfo;

                return `[${timestamp}] WINSTON [${level}]: ${message}`;
              })
            )
          }),
          new DailyRotateFile({
            level: 'error',
            handleExceptions: true,
            handleRejections: true,
            filename: 'logs/error-%DATE%.log',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            maxSize: '3m',
            maxFiles: '3d'
          })
        ],
        exitOnError: false
      })
    }),
    AuthModule,
    CategoryModule,
    CoreModule,
    EmailModule,
    FileModule,
    PasswordModule,
    PostModule,
    UserModule,
    UtilitiesModule
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [AuthModule, CategoryModule, CoreModule, FileModule, PostModule, UserModule]
})
export class AppModule {}
