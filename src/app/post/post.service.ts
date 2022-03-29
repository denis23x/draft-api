/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Post, Prisma } from '@prisma/client';
import { PostCreateDto, PostGetAllDto, PostGetOneDto, PostUpdateDto } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, postCreateDto: PostCreateDto): Promise<Post> {
    const { categoryId, ...rest } = postCreateDto;

    const postCreateArgs: Prisma.PostCreateArgs = {
      select: this.prismaService.setPostSelect(),
      data: {
        ...rest,
        user: {
          connect: {
            id: (request.user as any).id
          }
        },
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    };

    return this.prismaService.post.create(postCreateArgs);
  }

  async getAll(request: Request, postGetAllDto: PostGetAllDto): Promise<Post[]> {
    const postFindManyArgs: Prisma.PostFindManyArgs = {
      select: this.prismaService.setPostSelect(),
      orderBy: {
        id: 'desc'
      },
      skip: 0,
      take: 10
    };

    if (!!postGetAllDto) {
      /** Search */

      if (postGetAllDto.hasOwnProperty('title')) {
        postFindManyArgs.where = {
          title: {
            contains: postGetAllDto.title
          }
        };
      }

      if (postGetAllDto.hasOwnProperty('userId')) {
        postFindManyArgs.where = {
          ...postFindManyArgs.where,
          userId: postGetAllDto.userId
        };
      }

      if (postGetAllDto.hasOwnProperty('categoryId')) {
        postFindManyArgs.where = {
          ...postFindManyArgs.where,
          categoryId: postGetAllDto.categoryId
        };
      }

      /** Scope */

      if (postGetAllDto.hasOwnProperty('scope')) {
        if (postGetAllDto.scope.includes('category')) {
          postFindManyArgs.select = {
            ...postFindManyArgs.select,
            category: {
              select: this.prismaService.setCategorySelect()
            }
          };
        }

        if (postGetAllDto.scope.includes('user')) {
          postFindManyArgs.select = {
            ...postFindManyArgs.select,
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }
      }

      /** Pagination */

      if (postGetAllDto.hasOwnProperty('page') && postGetAllDto.hasOwnProperty('size')) {
        const { skip, take } = this.prismaService.setPagination(postGetAllDto);

        postFindManyArgs.skip = skip;
        postFindManyArgs.take = take;
      }
    }

    return this.prismaService.post.findMany(postFindManyArgs);
  }

  async getOne(request: Request, id: number, postGetOneDto: PostGetOneDto): Promise<Post> {
    const postFindUniqueArgs: Prisma.PostFindUniqueArgs = {
      select: this.prismaService.setPostSelect(),
      where: {
        id
      }
    };

    if (!!postGetOneDto) {
      /** Scope */

      if (postGetOneDto.hasOwnProperty('scope')) {
        if (postGetOneDto.scope.includes('category')) {
          postFindUniqueArgs.select = {
            ...postFindUniqueArgs.select,
            category: {
              select: this.prismaService.setCategorySelect()
            }
          };
        }

        if (postGetOneDto.scope.includes('user')) {
          postFindUniqueArgs.select = {
            ...postFindUniqueArgs.select,
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }
      }
    }

    return this.prismaService.post.findUnique(postFindUniqueArgs);
  }

  async update(request: Request, id: number, postUpdateDto: PostUpdateDto): Promise<Post> {
    const postUpdateArgs: Prisma.PostUpdateArgs = {
      select: this.prismaService.setPostSelect(),
      where: {
        id
      },
      // @ts-ignore
      data: postUpdateDto
    };

    return this.prismaService.post.update(postUpdateArgs);
  }

  async delete(request: Request, id: number): Promise<Post> {
    const postDeleteArgs: Prisma.PostDeleteArgs = {
      select: this.prismaService.setPostSelect(),
      where: {
        id
      }
    };

    return this.prismaService.post.delete(postDeleteArgs);
  }
}
