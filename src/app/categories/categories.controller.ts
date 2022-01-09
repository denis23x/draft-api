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
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IdentifierDto, TransformInterceptor } from '../core';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async create(@Body() createDto: CreateDto, @Req() request: Request): Promise<Category> {
    return await this.categoriesService.create(createDto, request);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getAll(@Query() getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesService.getAll(getAllDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<Category> {
    return await this.categoriesService.getOne(identifierDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async update(
    @Param() identifierDto: IdentifierDto,
    @Body() updateDto: UpdateDto,
    @Req() request: Request
  ): Promise<Category> {
    return await this.categoriesService.update(identifierDto, updateDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  async delete(@Param() identifierDto: IdentifierDto, @Req() request: Request): Promise<Category> {
    return await this.categoriesService.delete(identifierDto, request);
  }
}
