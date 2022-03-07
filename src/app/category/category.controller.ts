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
import { CreateDto, CategoryDto, GetAllDto, GetOneDto, UpdateDto } from './dto';
import { Request } from 'express';
import { Category } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Create category'
  })
  @ApiResponse({
    status: 201,
    type: CategoryDto
  })
  @ApiBearerAuth('accessToken')
  @Post()
  @UseGuards(AuthGuard('custom'))
  async create(@Req() request: Request, @Body() createDto: CreateDto): Promise<Category> {
    return this.categoryService.create(request, createDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get all categories'
  })
  @ApiResponse({
    status: 200,
    type: CategoryDto,
    isArray: true
  })
  @Get()
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<Category[]> {
    return this.categoryService.getAll(request, getAllDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get category'
  })
  @ApiResponse({
    status: 200,
    type: CategoryDto
  })
  @Get(':id')
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() getOneDto: GetOneDto): Promise<Category> {
    return this.categoryService.getOne(request, id, getOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update category'
  })
  @ApiResponse({
    status: 200,
    type: CategoryDto
  })
  @ApiBearerAuth('accessToken')
  @Put(':id')
  @UseGuards(AuthGuard('custom'))
  async update(@Req() request: Request, @Param('id') id: number, @Body() updateDto: UpdateDto): Promise<Category> {
    return this.categoryService.update(request, id, updateDto);
  }

  @ApiOperation({
    description: '## Delete category'
  })
  @ApiResponse({
    status: 200,
    type: CategoryDto
  })
  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @UseGuards(AuthGuard('custom'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<Category> {
    return this.categoryService.delete(request, id);
  }
}
