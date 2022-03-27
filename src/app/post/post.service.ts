/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Post } from '@prisma/client';
import { PostCreateDto, PostGetAllDto, PostGetOneDto, PostUpdateDto } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, postCreateDto: PostCreateDto): Promise<Post> {
    const { categoryId, ...rest } = postCreateDto;

    // @ts-ignore
    return this.prismaService.post.create({
      ...this.prismaService.setPostSelect(),
      data: {
        ...rest,
        user: {
          connect: {
            // @ts-ignore
            id: request.user.id
          }
        },
        category: {
          connect: {
            id: categoryId
          }
        }
      }
    });
  }

  async getAll(request: Request, postGetAllDto: PostGetAllDto): Promise<Post[]> {
    let postFindManyArgs: any = {
      ...this.prismaService.setPostSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!postGetAllDto) {
      /** Search */

      if (postGetAllDto.hasOwnProperty('title')) {
        postFindManyArgs = this.prismaService.setWhere(postFindManyArgs, postGetAllDto, 'title');
      }

      /** Scope */

      if (postGetAllDto.hasOwnProperty('scope')) {
        if (postGetAllDto.scope.includes('category')) {
          postFindManyArgs.select = {
            ...postFindManyArgs.select,
            category: {
              ...this.prismaService.setCategorySelect()
            }
          };
        }

        if (postGetAllDto.scope.includes('user')) {
          postFindManyArgs.select = {
            ...postFindManyArgs.select,
            user: {
              ...this.prismaService.setNonSensitiveUserSelect()
            }
          };
        }
      }

      /** Pagination */

      if (postGetAllDto.hasOwnProperty('page') && postGetAllDto.hasOwnProperty('size')) {
        postFindManyArgs = this.prismaService.setPagination(postFindManyArgs, postGetAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.post.findMany(postFindManyArgs);
  }

  async getOne(request: Request, id: number, postGetOneDto: PostGetOneDto): Promise<Post> {
    let postFindUniqueArgs: any = {
      ...this.prismaService.setPostSelect(),
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
              ...this.prismaService.setCategorySelect()
            }
          };
        }

        if (postGetOneDto.scope.includes('user')) {
          postFindUniqueArgs.select = {
            ...postFindUniqueArgs.select,
            user: {
              ...this.prismaService.setNonSensitiveUserSelect()
            }
          };
        }
      }
    }

    // @ts-ignore
    return this.prismaService.post.findUnique(postFindUniqueArgs);
  }

  async update(request: Request, id: number, postUpdateDto: PostUpdateDto): Promise<Post> {
    // @ts-ignore
    return this.prismaService.post.update({
      ...this.prismaService.setPostSelect(),
      where: {
        id
      },
      data: postUpdateDto
    });
  }

  async delete(request: Request, id: number): Promise<Post> {
    // @ts-ignore
    return this.prismaService.post.delete({
      ...this.prismaService.setPostSelect(),
      where: {
        id
      }
    });
  }
}
