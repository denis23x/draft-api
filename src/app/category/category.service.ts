/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category, Prisma } from '@prisma/client';
import { CategoryCreateDto, CategoryGetAllDto, CategoryGetOneDto, CategoryUpdateDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, categoryCreateDto: CategoryCreateDto): Promise<Category> {
    const categoryCreateArgs: Prisma.CategoryCreateArgs = {
      ...this.prismaService.setCategorySelect(),
      data: {
        ...categoryCreateDto,
        user: {
          connect: {
            id: (request.user as any).id
          }
        }
      }
    };

    // @ts-ignore
    return this.prismaService.category.create(categoryCreateArgs);
  }

  async getAll(request: Request, categoryGetAllDto: CategoryGetAllDto): Promise<Category[]> {
    const categoryFindManyArgs: Prisma.CategoryFindManyArgs = {
      ...this.prismaService.setCategorySelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!categoryGetAllDto) {
      /** Search */

      if (categoryGetAllDto.hasOwnProperty('name')) {
        categoryFindManyArgs.where = {
          name: {
            contains: categoryGetAllDto.name
          }
        };
      }

      /** Scope */

      if (categoryGetAllDto.hasOwnProperty('scope')) {
        if (categoryGetAllDto.scope.includes('user')) {
          categoryFindManyArgs.select = {
            ...categoryFindManyArgs.select,
            user: this.prismaService.setUserSelect()
          };
        }

        if (categoryGetAllDto.scope.includes('posts')) {
          categoryFindManyArgs.select = {
            ...categoryFindManyArgs.select,
            posts: {
              ...this.prismaService.setPostSelect(),
              ...this.prismaService.setOrder()
            }
          };
        }
      }

      /** Pagination */

      // prettier-ignore
      if (categoryGetAllDto.hasOwnProperty('page') && categoryGetAllDto.hasOwnProperty('size')) {
        const { skip, take } = this.prismaService.setPagination(categoryGetAllDto);

        categoryFindManyArgs.skip = skip;
        categoryFindManyArgs.take = take;
      }
    }

    // @ts-ignore
    return this.prismaService.category.findMany(categoryFindManyArgs);
  }

  // prettier-ignore
  async getOne(request: Request, id: number, categoryGetOneDto: CategoryGetOneDto): Promise<Category> {
    const categoryFindUniqueArgs: Prisma.CategoryFindUniqueArgs = {
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      }
    };

    if (!!categoryGetOneDto) {
      /** Scope */

      if (categoryGetOneDto.hasOwnProperty('scope')) {
        if (categoryGetOneDto.scope.includes('user')) {
          categoryFindUniqueArgs.select = {
            ...categoryFindUniqueArgs.select,
            user: this.prismaService.setUserSelect()
          };
        }

        if (categoryGetOneDto.scope.includes('posts')) {
          categoryFindUniqueArgs.select = {
            ...categoryFindUniqueArgs.select,
            posts: {
              ...this.prismaService.setPostSelect(),
              ...this.prismaService.setOrder()
            }
          };
        }
      }
    }

    // @ts-ignore
    return this.prismaService.category.findUnique(categoryFindUniqueArgs);
  }

  // prettier-ignore
  async update(request: Request, id: number, categoryUpdateDto: CategoryUpdateDto): Promise<Category> {
    const categoryUpdateArgs: Prisma.CategoryUpdateArgs = {
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      },
      data: categoryUpdateDto
    };

    // @ts-ignore
    return this.prismaService.category.update(categoryUpdateArgs);
  }

  async delete(request: Request, id: number): Promise<Category> {
    const categoryDeleteArgs: Prisma.CategoryDeleteArgs = {
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      }
    };

    // @ts-ignore
    return this.prismaService.category.delete(categoryDeleteArgs);
  }
}
