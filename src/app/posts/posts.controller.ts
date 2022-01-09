/** @format */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { Post as PostEntity } from './posts.entity';
import { PostsService } from './posts.service';
import { IdentifierDto, TransformInterceptor } from '../core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async create(@Body() createDto: CreateDto, @Req() request: Request): Promise<PostEntity> {
    return await this.postsService.create(createDto, request);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getAll(@Query() getAllDto: GetAllDto): Promise<PostEntity[]> {
    return await this.postsService.getAll(getAllDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<PostEntity> {
    return await this.postsService.getOne(identifierDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async update(
    @Param() identifierDto: IdentifierDto,
    @Body() updateDto: UpdateDto,
    @Req() request: Request
  ): Promise<PostEntity> {
    return await this.postsService.update(identifierDto, updateDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  async delete(
    @Param() identifierDto: IdentifierDto,
    @Req() request: Request
  ): Promise<PostEntity> {
    return await this.postsService.delete(identifierDto, request);
  }
}
