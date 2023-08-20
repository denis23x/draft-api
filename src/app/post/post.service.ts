/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Post, Prisma } from '@prisma/client';
import { PostCreateDto, PostGetAllDto, PostGetOneDto, PostUpdateDto } from './dto';
import { stat, unlink } from 'fs';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, postCreateDto: PostCreateDto): Promise<Post> {
    const { categoryId, ...rest } = postCreateDto;

    const postCreateArgs: Prisma.PostCreateArgs = {
      select: {
        ...this.prismaService.setPostSelect(),
        category: {
          select: this.prismaService.setCategorySelect()
        },
        user: {
          select: this.prismaService.setUserSelect()
        }
      },
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
      select: {
        ...this.prismaService.setPostSelect(),
        markdown: false
      },
      orderBy: {
        id: 'desc'
      },
      skip: 0,
      take: 10
    };

    if (!!postGetAllDto) {
      /** Fulltext search */

      if (postGetAllDto.hasOwnProperty('query')) {
        postFindManyArgs.where = {
          name: {
            search: postGetAllDto.query + '*'
          },
          description: {
            search: postGetAllDto.query + '*'
          }
        };

        // postFindManyArgs.orderBy = {
        //   _relevance: {
        //     fields: ['name', 'description'],
        //     search: postGetAllDto.name,
        //     sort: 'desc'
        //   }
        // };
      }

      /** Filter */

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
    const postFindUniqueOrThrowArgs: Prisma.PostFindUniqueOrThrowArgs = {
      select: this.prismaService.setPostSelect(),
      where: {
        id
      }
    };

    if (!!postGetOneDto) {
      /** Scope */

      if (postGetOneDto.hasOwnProperty('scope')) {
        if (postGetOneDto.scope.includes('category')) {
          postFindUniqueOrThrowArgs.select = {
            ...postFindUniqueOrThrowArgs.select,
            category: {
              select: this.prismaService.setCategorySelect()
            }
          };
        }

        if (postGetOneDto.scope.includes('user')) {
          postFindUniqueOrThrowArgs.select = {
            ...postFindUniqueOrThrowArgs.select,
            user: {
              select: this.prismaService.setUserSelect()
            }
          };
        }
      }
    }

    return this.prismaService.post
      .findUniqueOrThrow(postFindUniqueOrThrowArgs)
      .catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, {
          code: 'P2001',
          clientVersion: Prisma.prismaVersion.client
        });
      });
  }

  async update(request: Request, id: number, postUpdateDto: PostUpdateDto): Promise<Post> {
    const postUpdateArgs: Prisma.PostUpdateArgs = {
      select: {
        ...this.prismaService.setPostSelect(),
        category: {
          select: this.prismaService.setCategorySelect()
        },
        user: {
          select: this.prismaService.setUserSelect()
        }
      },
      where: {
        id
      },
      data: postUpdateDto
    };

    /** Get current state for next expressions */

    const postFindUniqueArgs: Prisma.PostFindUniqueArgs = {
      select: {
        image: true
      },
      where: {
        id
      }
    };

    const postCurrent: Post = await this.prismaService.post.findUnique(postFindUniqueArgs);

    return this.prismaService.post.update(postUpdateArgs).then((post: Post) => {
      if (postUpdateDto.hasOwnProperty('image')) {
        const image: string = postCurrent.image?.split('/').pop();
        const imagePath: string = './upload/images/' + image;

        // TODO: add log
        // Review logic because post can be updated with same image
        // Review the same in user update

        stat(imagePath, (error: NodeJS.ErrnoException | null) => {
          if (!!error) {
            console.log(error);
          } else {
            unlink(imagePath, (error: NodeJS.ErrnoException | null) => {
              if (!!error) {
                console.log(error);
              }
            });
          }
        });
      }

      return post;
    });
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
