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
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  GetAllCategoryDto,
  GetOneCategoryDto,
  UpdateCategoryDto
} from './category.dto';
import { Request } from 'express';
import { PrismaExceptionFilter } from '../core';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(PrismaExceptionFilter)
  async create(
    @Req() request: Request,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return this.categoryService.create(request, createCategoryDto);
  }

  @Get()
  async getAll(
    @Req() request: Request,
    @Query() cetAllCategoryDto: GetAllCategoryDto
  ): Promise<Category[]> {
    return this.categoryService.getAll(request, cetAllCategoryDto);
  }

  @Get(':id')
  async getOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Query() cetOneCategoryDto: GetOneCategoryDto
  ): Promise<Category> {
    return this.categoryService.getOne(request, id, cetOneCategoryDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(PrismaExceptionFilter)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.update(request, id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<Category> {
    return this.categoryService.delete(request, id);
  }
}
