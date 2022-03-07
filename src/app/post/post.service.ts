/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Post } from '@prisma/client';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, createDto: CreateDto): Promise<Post> {
    const { categoryId, ...rest } = createDto;

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

  async getAll(request: Request, getAllDto: GetAllDto): Promise<Post[]> {
    let postFindManyArgs: any = {
      ...this.prismaService.setPostSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!getAllDto) {
      /** Search */

      if (getAllDto.hasOwnProperty('title')) {
        postFindManyArgs = this.prismaService.setWhere(postFindManyArgs, getAllDto, 'title');
      }

      /** Scope */

      if (getAllDto.hasOwnProperty('scope')) {
        if (getAllDto.scope.includes('categories')) {
        }

        if (getAllDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (getAllDto.hasOwnProperty('page') && getAllDto.hasOwnProperty('size')) {
        postFindManyArgs = this.prismaService.setPagination(postFindManyArgs, getAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.post.findMany(postFindManyArgs);
  }

  async getOne(request: Request, id: number, getOneDto: GetOneDto): Promise<Post> {
    // @ts-ignore
    return this.prismaService.post.findUnique({
      ...this.prismaService.setPostSelect(),
      where: {
        id
      }
    });
  }

  async update(request: Request, id: number, updateDto: UpdateDto): Promise<Post> {
    // @ts-ignore
    return this.prismaService.post.update({
      ...this.prismaService.setPostSelect(),
      where: {
        id
      },
      data: updateDto
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
