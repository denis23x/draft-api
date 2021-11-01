/** @format */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetAllDto, GetOneDto } from './posts.dto';
import { Post } from './posts.entity';
import { PostsService } from './posts.service';
import { IdentifierDto } from '../core';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getAll(@Query() getAllDto: GetAllDto): Promise<Post[]> {
    return await this.postsService.getAll(getAllDto);
  }

  @Get(':id')
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<Post> {
    return await this.postsService.getOne(identifierDto, getOneDto);
  }
}
