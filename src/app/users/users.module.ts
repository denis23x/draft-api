/** @format */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './users.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
  providers: [UsersService, UsersRepository]
})
export class UsersModule {}
