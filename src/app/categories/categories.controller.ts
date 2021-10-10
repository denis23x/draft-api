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
import { CreateDto, FindAllDto, FindOneDto } from './categories.dto';
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
  async create(@Body() createDto: CreateDto, @Req() request: Request): Promise<Category> {
    return this.categoriesService.create(createDto, request);
  }

  @Get()
  async findAll(@Query() findAllDto: FindAllDto): Promise<Category[]> {
    return this.categoriesService.findAll(findAllDto);
  }

  @Get(':id')
  async findOne(@Param() findOneDto: FindOneDto): Promise<Category> {
    return this.categoriesService.findOne(findOneDto);
  }
}
