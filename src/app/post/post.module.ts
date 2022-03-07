/** @format */

import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  controllers: [PostController],
  exports: [PostService],
  providers: [PostService]
})
export class PostModule {}
