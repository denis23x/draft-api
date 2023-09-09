/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ImageService, PrismaService } from '../core';
import { Post, Prisma } from '@database/client';
import { PostCreateDto, PostGetAllDto, PostGetOneDto, PostUpdateDto } from './dto';

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly imageService: ImageService
  ) {}

  async create(request: Request, postCreateDto: PostCreateDto): Promise<Post> {
    const { categoryId, image, ...postCreateDtoData } = postCreateDto;

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
        ...postCreateDtoData,
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

    if (!!image) {
      postCreateArgs.data = {
        ...postCreateArgs.data,
        image: await this.imageService.getWebpImage(image, 'post-images')
      };
    }

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

        /** Default relevant order */

        postFindManyArgs.orderBy = {
          _relevance: {
            fields: ['name', 'description'],
            search: postGetAllDto.query,
            sort: 'asc'
          }
        };
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

      /** Order */

      if (postGetAllDto.hasOwnProperty('orderBy')) {
        postFindManyArgs.orderBy = {
          ...postFindManyArgs.orderBy,
          id: postGetAllDto.orderBy === 'newest' ? 'desc' : 'asc'
        };

        /** For full text search make PostOrderByWithRelationAndSearchRelevanceInput[] */

        postFindManyArgs.orderBy = Object.entries(postFindManyArgs.orderBy).map((entry: any) => {
          const key: string = entry[0];
          const value: any = entry[1];

          return {
            [key]: value
          };
        });
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
    const { image, ...postUpdateDtoData } = postUpdateDto;

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
      data: postUpdateDtoData
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

    if (!!image) {
      postUpdateArgs.data = {
        ...postUpdateArgs.data,
        image: await this.imageService.getWebpImage(image, 'post-images')
      };
    }

    return this.prismaService.post.update(postUpdateArgs).then((post: Post) => {
      if (!!image) {
        this.imageService.getWebpImageRemove(postCurrent.image, 'post-images');
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

    return this.prismaService.post.delete(postDeleteArgs).then((post: Post) => {
      if (!!post.image) {
        this.imageService.getWebpImageRemove(post.image, 'post-images');
      }

      return post;
    });
  }
}
