/** @format */

import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CoreModule } from './core';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    AuthModule,
    CategoryModule,
    CoreModule,
    UserModule
  ],
  exports: [AuthModule, CategoryModule, CoreModule, UserModule]
})
export class AppModule {}
