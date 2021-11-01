/** @format */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllDto } from './posts.dto';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';
import { IdentifierDto } from '../core';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(@Query() findAllDto: FindAllDto): Promise<Post[]> {
    return await this.postsService.getAll(findAllDto);
  }

  @Get(':id')
  async getOne(@Param() identifierDto: IdentifierDto): Promise<Post> {
    return await this.postsService.getOne(identifierDto);
  }
}
