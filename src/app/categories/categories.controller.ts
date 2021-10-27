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
import { CreateDto, FindAllDto, UpdateDto } from './categories.dto';
import { Category } from './categories.entity';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IdentifierDto } from '../core';

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
  async findOne(@Param() identifierDto: IdentifierDto): Promise<Category> {
    return this.categoriesService.findOne(identifierDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOne(
    @Param() identifierDto: IdentifierDto,
    @Body() updateDto: UpdateDto,
    @Req() request: Request
  ): Promise<Category> {
    return this.categoriesService.updateOne(identifierDto, updateDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Param() identifierDto: IdentifierDto,
    @Req() request: Request
  ): Promise<Category> {
    return this.categoriesService.deleteOne(identifierDto, request);
  }
}
