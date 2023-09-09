/** @format */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { PostCreateDto, PostGetAllDto, PostGetOneDto, PostDto, PostUpdateDto } from './dto';
import { Request } from 'express';
import { Post as PostModel } from '@database/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostRelationGuard } from '../auth/guards';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Create post'
  })
  @ApiResponse({
    status: 201,
    type: PostDto
  })
  @ApiBearerAuth('access')
  @Post()
  @UseGuards(AuthGuard('access'))
  async create(@Req() request: Request, @Body() postCreateDto: PostCreateDto): Promise<PostModel> {
    return this.postService.create(request, postCreateDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get all posts'
  })
  @ApiResponse({
    status: 200,
    type: PostDto,
    isArray: true
  })
  @Get()
  async getAll(@Req() request: Request, @Query() postGetAllDto: PostGetAllDto): Promise<PostModel[]> {
    return this.postService.getAll(request, postGetAllDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get post'
  })
  @ApiResponse({
    status: 200,
    type: PostDto
  })
  @Get(':id')
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() postGetOneDto: PostGetOneDto): Promise<PostModel> {
    return this.postService.getOne(request, id, postGetOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update post'
  })
  @ApiResponse({
    status: 200,
    type: PostDto
  })
  @ApiBearerAuth('access')
  @Put(':id')
  @UseGuards(AuthGuard('access'), PostRelationGuard)
  async update(@Req() request: Request, @Param('id') id: number, @Body() postUpdateDto: PostUpdateDto): Promise<PostModel> {
    return this.postService.update(request, id, postUpdateDto);
  }

  @ApiOperation({
    description: '## Delete post'
  })
  @ApiResponse({
    status: 200,
    type: PostDto
  })
  @ApiBearerAuth('access')
  @Delete(':id')
  @UseGuards(AuthGuard('access'), PostRelationGuard)
  async delete(@Req() request: Request, @Param('id') id: number): Promise<PostModel> {
    return this.postService.delete(request, id);
  }
}
