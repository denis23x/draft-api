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
  CategoryDto,
  CategoryCreateDto,
  CategoryDeleteDto,
  CategoryGetAllDto,
  CategoryGetOneDto,
  CategoryUpdateDto
} from './dto';
import { Request } from 'express';
import { Category } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryRelationGuard } from '../auth/guards';

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
  async create(@Req() request: Request, @Body() categoryCreateDto: CategoryCreateDto): Promise<Category> {
    return this.categoryService.create(request, categoryCreateDto);
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
  async getAll(@Req() request: Request, @Query() categoryGetAllDto: CategoryGetAllDto): Promise<Category[]> {
    return this.categoryService.getAll(request, categoryGetAllDto);
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
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() categoryGetOneDto: CategoryGetOneDto): Promise<Category> {
    return this.categoryService.getOne(request, id, categoryGetOneDto);
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
  @UseGuards(AuthGuard('custom'), CategoryRelationGuard)
  async update(@Req() request: Request, @Param('id') id: number, @Body() categoryUpdateDto: CategoryUpdateDto): Promise<Category> {
    return this.categoryService.update(request, id, categoryUpdateDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Delete category'
  })
  @ApiResponse({
    status: 200,
    type: CategoryDto
  })
  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @UseGuards(AuthGuard('custom'), CategoryRelationGuard)
  async delete(@Req() request: Request, @Param('id') id: number, @Query() categoryDeleteDto: CategoryDeleteDto): Promise<Category> {
    return this.categoryService.delete(request, id, categoryDeleteDto);
  }
}
