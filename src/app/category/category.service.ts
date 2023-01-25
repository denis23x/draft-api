/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category, Prisma } from '@prisma/client';
import {
  CategoryCreateDto,
  CategoryDeleteDto,
  CategoryGetAllDto,
  CategoryGetOneDto,
  CategoryUpdateDto
} from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, categoryCreateDto: CategoryCreateDto): Promise<Category> {
    const categoryCreateArgs: Prisma.CategoryCreateArgs = {
      select: this.prismaService.setCategorySelect(),
      data: {
        ...categoryCreateDto,
        user: {
          connect: {
            id: (request.user as any).id
          }
        }
      }
    };

    return this.prismaService.category.create(categoryCreateArgs);
  }

  async getAll(request: Request, categoryGetAllDto: CategoryGetAllDto): Promise<Category[]> {
    const categoryFindManyArgs: Prisma.CategoryFindManyArgs = {
      select: this.prismaService.setCategorySelect(),
      orderBy: {
        id: 'desc'
      },
      skip: 0,
      take: 10
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

      if (categoryGetAllDto.hasOwnProperty('userId')) {
        categoryFindManyArgs.where = {
          ...categoryFindManyArgs.where,
          userId: categoryGetAllDto.userId
        };
      }

      /** Scope */

      if (categoryGetAllDto.hasOwnProperty('scope')) {
        if (categoryGetAllDto.scope.includes('user')) {
          categoryFindManyArgs.select = {
            ...categoryFindManyArgs.select,
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }

        if (categoryGetAllDto.scope.includes('posts')) {
          categoryFindManyArgs.select = {
            ...categoryFindManyArgs.select,
            posts: {
              select: this.prismaService.setPostSelect(),
              orderBy: {
                id: 'desc'
              }
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

    return this.prismaService.category.findMany(categoryFindManyArgs);
  }

  // prettier-ignore
  async getOne(request: Request, id: number, categoryGetOneDto: CategoryGetOneDto): Promise<Category> {
    const categoryFindUniqueArgs: Prisma.CategoryFindUniqueArgs = {
      select: this.prismaService.setCategorySelect(),
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
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }

        if (categoryGetOneDto.scope.includes('posts')) {
          categoryFindUniqueArgs.select = {
            ...categoryFindUniqueArgs.select,
            posts: {
              select: this.prismaService.setPostSelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }
      }
    }

    return this.prismaService.category.findUnique(categoryFindUniqueArgs);
  }

  // prettier-ignore
  async update(request: Request, id: number, categoryUpdateDto: CategoryUpdateDto): Promise<Category> {
    const categoryUpdateArgs: Prisma.CategoryUpdateArgs = {
      select: this.prismaService.setCategorySelect(),
      where: {
        id
      },
      data: categoryUpdateDto
    };

    return this.prismaService.category.update(categoryUpdateArgs);
  }

  // prettier-ignore
  async delete(request: Request, id: number, categoryDeleteDto: CategoryDeleteDto): Promise<Category> {
    const categoryDeleteArgs: Prisma.CategoryDeleteArgs = {
      select: this.prismaService.setCategorySelect(),
      where: {
        id
      }
    };

    if (!!categoryDeleteDto) {
      if (categoryDeleteDto.hasOwnProperty('categoryId')) {
        const postUpdateManyArgs: Prisma.PostUpdateManyArgs = {
          where: {
            categoryId: id
          },
          data: categoryDeleteDto
        };

        await this.prismaService.post.updateMany(postUpdateManyArgs);
      }
    }

    return this.prismaService.category.delete(categoryDeleteArgs);
  }
}
