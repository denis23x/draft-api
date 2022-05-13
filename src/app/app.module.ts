/** @format */

import { Module, Global, CacheModule, CacheInterceptor } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CoreModule } from './core';
import { PostModule } from './post/post.module';
import { UploadModule } from './upload/upload.module';
import { UserModule } from './user/user.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
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
    PostModule,
    UploadModule,
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
  exports: [AuthModule, CategoryModule, CoreModule, PostModule, UploadModule, UserModule]
})
export class AppModule {}
