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
import { CreateDto, GetAllDto, UpdateDto } from './categories.dto';
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
  async createOne(@Body() createDto: CreateDto, @Req() request: Request): Promise<Category> {
    return await this.categoriesService.createOne(createDto, request);
  }

  @Get()
  async getAll(@Query() getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesService.getAll(getAllDto);
  }

  @Get(':id')
  async getOne(@Param() identifierDto: IdentifierDto): Promise<Category> {
    return await this.categoriesService.getOne(identifierDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOne(
    @Param() identifierDto: IdentifierDto,
    @Body() updateDto: UpdateDto,
    @Req() request: Request
  ): Promise<Category> {
    return await this.categoriesService.updateOne(identifierDto, updateDto, request);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOne(
    @Param() identifierDto: IdentifierDto,
    @Req() request: Request
  ): Promise<Category> {
    return await this.categoriesService.deleteOne(identifierDto, request);
  }
}
