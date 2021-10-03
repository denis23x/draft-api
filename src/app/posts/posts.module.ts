/** @format */

import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from './posts.service';
import { PostsRepository } from './posts.repository';
import { Post } from './posts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  exports: [PostsService, PostsRepository],
  providers: [PostsService, PostsRepository]
})
export class PostsModule {}
