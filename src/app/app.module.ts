/** @format */

import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      charset: 'utf8mb4',
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    CategoriesModule,
    PostsModule,
    TokensModule,
    UsersModule
  ],
  exports: [AuthModule, CategoriesModule, PostsModule, TokensModule, UsersModule]
})
export class AppModule {}
