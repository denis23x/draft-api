/** @format */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { CreateCategoryDto, FindAllCategoriesDto, FindOneCategoryDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() request: Request
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto, request);
  }

  @Get()
  async findAll(@Query() findAllCategoriesDto: FindAllCategoriesDto): Promise<Category[]> {
    return this.categoriesService.findAll(findAllCategoriesDto);
  }

  @Get(':id')
  async findOne(@Param() findOneCategoryDto: FindOneCategoryDto): Promise<Category> {
    return this.categoriesService.findOne(findOneCategoryDto);
  }
}
