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
import { IdDto, TransformInterceptor } from '../core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async create(@Req() request: Request, @Body() createDto: CreateDto): Promise<PostEntity> {
    return await this.postsService.create(request, createDto);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<PostEntity[]> {
    return await this.postsService.getAll(request, getAllDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async getOne(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Query() getOneDto: GetOneDto
  ): Promise<PostEntity> {
    return await this.postsService.getOne(request, idDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async update(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Body() updateDto: UpdateDto
  ): Promise<PostEntity> {
    return await this.postsService.update(request, idDto, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  async delete(@Req() request: Request, @Param() idDto: IdDto): Promise<PostEntity> {
    return await this.postsService.delete(request, idDto);
  }
}
