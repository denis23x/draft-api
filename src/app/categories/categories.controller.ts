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
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IdDto, TransformInterceptor, TypeORMExceptionFilter } from '../core';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  @UseFilters(TypeORMExceptionFilter)
  async create(@Req() request: Request, @Body() createDto: CreateDto): Promise<Category> {
    return await this.categoriesService.create(request, createDto);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesService.getAll(request, getAllDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async getOne(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Query() getOneDto: GetOneDto
  ): Promise<Category> {
    return await this.categoriesService.getOne(request, idDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  @UseFilters(TypeORMExceptionFilter)
  async update(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Body() updateDto: UpdateDto
  ): Promise<Category> {
    return await this.categoriesService.update(request, idDto, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  async delete(@Req() request: Request, @Param() idDto: IdDto): Promise<Category> {
    return await this.categoriesService.delete(request, idDto);
  }
}
