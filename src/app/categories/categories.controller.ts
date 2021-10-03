/** @format */

import { Controller, Get, Param, Query } from '@nestjs/common';
import { FindAllCategoriesDto, FindOneCategoryDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Query() findAllCategoriesDto: FindAllCategoriesDto): Promise<Category[]> {
    return this.categoriesService.findAll(findAllCategoriesDto);
  }

  @Get(':id')
  async findOne(@Param() findOneCategoryDto: FindOneCategoryDto): Promise<Category> {
    return this.categoriesService.findOne(findOneCategoryDto);
  }
}
