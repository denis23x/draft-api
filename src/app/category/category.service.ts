/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Category } from '@prisma/client';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, createDto: CreateDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.create({
      ...this.prismaService.setCategorySelect(),
      data: {
        ...createDto,
        user: {
          connect: {
            // @ts-ignore
            id: request.user.id
          }
        }
      }
    });
  }

  async getAll(request: Request, getAllDto: GetAllDto): Promise<Category[]> {
    let categoryFindManyArgs: any = {
      ...this.prismaService.setCategorySelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!getAllDto) {
      /** Search */

      if (getAllDto.hasOwnProperty('name')) {
        categoryFindManyArgs = this.prismaService.setWhere(categoryFindManyArgs, getAllDto, 'name');
      }

      /** Scope */

      if (getAllDto.hasOwnProperty('scope')) {
        if (getAllDto.scope.includes('user')) {
        }

        if (getAllDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (getAllDto.hasOwnProperty('page') && getAllDto.hasOwnProperty('size')) {
        categoryFindManyArgs = this.prismaService.setPagination(categoryFindManyArgs, getAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.category.findMany(categoryFindManyArgs);
  }

  async getOne(request: Request, id: number, getOneDto: GetOneDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.findUnique({
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      }
    });
  }

  async update(request: Request, id: number, updateDto: UpdateDto): Promise<Category> {
    // @ts-ignore
    return this.prismaService.category.update({
      ...this.prismaService.setCategorySelect(),
      where: {
        id
      },
      data: updateDto
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
