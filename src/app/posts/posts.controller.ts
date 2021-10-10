/** @format */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllDto, FindOneDto } from './posts.dto';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async findAll(@Query() findAllDto: FindAllDto): Promise<Post[]> {
    return this.postsService.findAll(findAllDto);
  }

  @Get(':id')
  async findOne(@Param() findOneDto: FindOneDto): Promise<Post> {
    return this.postsService.findOne(findOneDto);
  }
}
