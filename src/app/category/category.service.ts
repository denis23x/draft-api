/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category } from '@prisma/client';
import { CategoryCreateDto, CategoryGetAllDto, CategoryGetOneDto, CategoryUpdateDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, categoryCreateDto: CategoryCreateDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.create({
      ...this.prismaService.setCategorySelect(),
      data: {
        ...categoryCreateDto,
        user: {
          connect: {
            // @ts-ignore
            id: request.user.id
          }
        }
      }
    });
  }

  async getAll(request: Request, categoryGetAllDto: CategoryGetAllDto): Promise<Category[]> {
    let categoryFindManyArgs: any = {
      ...this.prismaService.setCategorySelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!categoryGetAllDto) {
      /** Search */

      if (categoryGetAllDto.hasOwnProperty('name')) {
        // prettier-ignore
        categoryFindManyArgs = this.prismaService.setWhere(categoryFindManyArgs, categoryGetAllDto, 'name');
      }

      /** Scope */

      if (categoryGetAllDto.hasOwnProperty('scope')) {
        if (categoryGetAllDto.scope.includes('user')) {
        }

        if (categoryGetAllDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (categoryGetAllDto.hasOwnProperty('page') && categoryGetAllDto.hasOwnProperty('size')) {
        // prettier-ignore
        categoryFindManyArgs = this.prismaService.setPagination(categoryFindManyArgs, categoryGetAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.category.findMany(categoryFindManyArgs);
  }

  // prettier-ignore
  async getOne(request: Request, id: number, categoryGetOneDto: CategoryGetOneDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.findUnique({
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      }
    });
  }

  // prettier-ignore
  async update(request: Request, id: number, categoryUpdateDto: CategoryUpdateDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.update({
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      },
      data: categoryUpdateDto
    });
  }

  async delete(request: Request, id: number): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.delete({
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      }
    });
  }
}
