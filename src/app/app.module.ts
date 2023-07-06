/** @format */

import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
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
import { LoggerModule } from 'nestjs-pino';
import { SerializerFn } from 'pino';
import { randomUUID } from 'crypto';

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
    LoggerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        pinoHttp: {
          redact: {
            paths: [
              'request.headers.authorization',
              'request.headers.cookie',
              'request.body.password',
              'request.body.newPassword',
              'request.body.newEmail',
              'request.body.fingerprint'
            ],
            remove: true
          },
          genReqId: () => randomUUID(),
          customProps: () => ({
            context: 'HTTP'
          }),
          serializers: {
            req(request: any): SerializerFn {
              request.body = request.raw.body;

              return request;
            }
          },
          customAttributeKeys: {
            req: 'request',
            res: 'response',
            err: 'error'
          },
          autoLogging: configService.get('APP_ENV') !== 'production',
          transport: {
            dedupe: true,
            targets: [
              {
                level: 'error',
                target: 'pino/file',
                options: {
                  destination: join(__dirname, '/error.log'),
                  mkdir: true
                }
              },
              {
                level: 'info',
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  colorizeObjects: true,
                  singleLine: false
                }
              }
            ]
          }
        }
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
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
  exports: [
    AuthModule,
    CategoryModule,
    CoreModule,
    EmailModule,
    FileModule,
    PasswordModule,
    PostModule,
    UserModule,
    UtilitiesModule
  ]
})
export class AppModule {}
