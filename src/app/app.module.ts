/** @format */

import { Module, Global, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.MAILER_HOST,
          port: 587,
          secure: false,
          auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD
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
      })
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    CacheModule.register({
      ttl: 5,
      max: 20
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 40
    }),
    AuthModule,
    CategoryModule,
    CoreModule,
    FileModule,
    PostModule,
    UserModule
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
