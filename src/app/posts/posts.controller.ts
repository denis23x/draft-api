/** @format */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllPostsDto, FindOnePostDto } from './posts.dto';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() findAllPostsDto: FindAllPostsDto): Promise<Post[]> {
    return this.postsService.findAll(findAllPostsDto);
  }

  @Get(':id')
  async findOne(@Param() findOnePostDto: FindOnePostDto): Promise<Post> {
    return this.postsService.findOne(findOnePostDto);
  }
}
