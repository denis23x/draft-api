/** @format */

import { Injectable } from '@nestjs/common';
import {
  CreateCategoryDto,
  GetAllCategoryDto,
  GetOneCategoryDto,
  UpdateCategoryDto
} from './category.dto';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, createCategoryDto: CreateCategoryDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.create({
      data: {
        ...createCategoryDto,
        user: {
          connect: {
            // @ts-ignore
            id: request.user.id
          }
        }
      }
    });
  }

  async getAll(request: Request, getAllCategoryDto: GetAllCategoryDto): Promise<Category[]> {
    let categoryFindManyArgs: any = {
      ...this.prismaService.setCategorySelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!getAllCategoryDto) {
      /** Search */

      if (getAllCategoryDto.hasOwnProperty('name')) {
        categoryFindManyArgs = this.prismaService.setWhere(
          categoryFindManyArgs,
          getAllCategoryDto,
          'name'
        );
      }

      /** Scope */

      if (getAllCategoryDto.hasOwnProperty('scope')) {
        if (getAllCategoryDto.scope.includes('user')) {
        }

        if (getAllCategoryDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (getAllCategoryDto.hasOwnProperty('page') && getAllCategoryDto.hasOwnProperty('size')) {
        categoryFindManyArgs = this.prismaService.setPagination(
          categoryFindManyArgs,
          getAllCategoryDto
        );
      }
    }

    // @ts-ignore
    return this.prismaService.category.findMany(categoryFindManyArgs);
  }

  async getOne(
    request: Request,
    id: number,
    getOneCategoryDto: GetOneCategoryDto
  ): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.findUnique({
      where: {
        id
      }
    });
  }

  async update(
    request: Request,
    id: number,
    updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.update({
      where: {
        id
      },
      data: updateCategoryDto
    });
  }

  async delete(request: Request, id: number): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.delete({
      where: {
        id
      }
    });
  }
}
