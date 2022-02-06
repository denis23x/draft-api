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
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  GetAllCategoryDto,
  GetOneCategoryDto,
  UpdateCategoryDto
} from './category.dto';
import { Request } from 'express';
import { Category } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // prettier-ignore
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Req() request: Request, @Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(request, createCategoryDto);
  }

  // prettier-ignore
  @Get()
  async getAll(@Req() request: Request, @Query() cetAllCategoryDto: GetAllCategoryDto): Promise<Category[]> {
    return this.categoryService.getAll(request, cetAllCategoryDto);
  }

  // prettier-ignore
  @Get(':id')
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() cetOneCategoryDto: GetOneCategoryDto
  ): Promise<Category> {
    return this.categoryService.getOne(request, id, cetOneCategoryDto);
  }

  // prettier-ignore
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() request: Request, @Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return this.categoryService.update(request, id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<Category> {
    return this.categoryService.delete(request, id);
  }
}
