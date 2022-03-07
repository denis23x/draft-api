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
import { CreateDto, GetAllDto, GetOneDto, PostDto, UpdateDto } from './dto';
import { Request } from 'express';
import { Post as PostModel } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiBearerAuth('accessToken')
  @Post()
  @UseGuards(AuthGuard('custom'))
  async create(@Req() request: Request, @Body() createDto: CreateDto): Promise<PostModel> {
    return this.postService.create(request, createDto);
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
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<PostModel[]> {
    return this.postService.getAll(request, getAllDto);
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
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() getOneDto: GetOneDto): Promise<PostModel> {
    return this.postService.getOne(request, id, getOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update post'
  })
  @ApiResponse({
    status: 200,
    type: PostDto
  })
  @ApiBearerAuth('accessToken')
  @Put(':id')
  @UseGuards(AuthGuard('custom'))
  async update(@Req() request: Request, @Param('id') id: number, @Body() updateDto: UpdateDto): Promise<PostModel> {
    return this.postService.update(request, id, updateDto);
  }

  @ApiOperation({
    description: '## Delete post'
  })
  @ApiResponse({
    status: 200,
    type: PostDto
  })
  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @UseGuards(AuthGuard('custom'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<PostModel> {
    return this.postService.delete(request, id);
  }
}
