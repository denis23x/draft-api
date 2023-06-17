/** @format */

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  exports: [UserService],
  providers: [UserService]
})
export class UserModule {}
