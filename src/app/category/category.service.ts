/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category, Prisma } from '@database/client';
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
      /** Fulltext search */

      if (categoryGetAllDto.hasOwnProperty('query')) {
        categoryFindManyArgs.where = {
          name: {
            search: categoryGetAllDto.query + '*'
          }
        };
      }

      /** Filter */

      if (categoryGetAllDto.hasOwnProperty('userId')) {
        categoryFindManyArgs.where = {
          ...categoryFindManyArgs.where,
          userId: categoryGetAllDto.userId
        };
      }

      /** Order */

      if (categoryGetAllDto.hasOwnProperty('orderBy')) {
        categoryFindManyArgs.orderBy = {
          ...categoryFindManyArgs.orderBy,
          id: categoryGetAllDto.orderBy === 'newest' ? 'desc' : 'asc'
        };

        /** For full text search make CategoryOrderByWithRelationAndSearchRelevanceInput[] */

        // prettier-ignore
        categoryFindManyArgs.orderBy = Object.entries(categoryFindManyArgs.orderBy).map((entry: any) => {
          const key: string = entry[0];
          const value: any = entry[1];

          return {
            [key]: value
          };
        });
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
    const categoryFindUniqueOrThrowArgs: Prisma.CategoryFindUniqueOrThrowArgs = {
      select: this.prismaService.setCategorySelect(),
      where: {
        id
      }
    };

    if (!!categoryGetOneDto) {
      /** Scope */

      if (categoryGetOneDto.hasOwnProperty('scope')) {
        if (categoryGetOneDto.scope.includes('user')) {
          categoryFindUniqueOrThrowArgs.select = {
            ...categoryFindUniqueOrThrowArgs.select,
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }

        if (categoryGetOneDto.scope.includes('posts')) {
          categoryFindUniqueOrThrowArgs.select = {
            ...categoryFindUniqueOrThrowArgs.select,
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

    return this.prismaService.category
      .findUniqueOrThrow(categoryFindUniqueOrThrowArgs)
      .catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, {
          code: 'P2001',
          clientVersion: Prisma.prismaVersion.client
        });
      });
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
