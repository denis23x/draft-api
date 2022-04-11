/** @format */

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CoreModule } from './core';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { APP_GUARD } from '@nestjs/core';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 40
    }),
    AuthModule,
    CategoryModule,
    CoreModule,
    PostModule,
    UserModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [AuthModule, CategoryModule, CoreModule, PostModule, UserModule]
})
export class AppModule {}
