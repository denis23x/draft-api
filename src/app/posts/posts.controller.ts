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
import { IdentifierDto } from '../core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async createOne(@Body() createDto: CreateDto, @Req() request: Request): Promise<PostEntity> {
    return await this.postsService.createOne(createDto, request);
  }

  @Get()
  async getAll(@Query() getAllDto: GetAllDto): Promise<PostEntity[]> {
    return await this.postsService.getAll(getAllDto);
  }

  @Get(':id')
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<PostEntity> {
    return await this.postsService.getOne(identifierDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOne(
    @Param() identifierDto: IdentifierDto,
    @Body() updateDto: UpdateDto,
    @Req() request: Request
  ): Promise<PostEntity> {
    return await this.postsService.updateOne(identifierDto, updateDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Param() identifierDto: IdentifierDto,
    @Req() request: Request
  ): Promise<PostEntity> {
    return await this.postsService.deleteOne(identifierDto, request);
  }
}
