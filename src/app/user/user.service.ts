/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { User } from '@prisma/client';
import { GetAllDto, GetOneDto, UpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(request: Request, getAllDto: GetAllDto): Promise<User[]> {
    let userFindManyArgs: any = {
      ...this.prismaService.setNonSensitiveUserSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!getAllDto) {
      /** Search */

      if (getAllDto.hasOwnProperty('name')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, getAllDto, 'name');
      }

      if (getAllDto.hasOwnProperty('email')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, getAllDto, 'email');
      }

      /** Scope */

      if (getAllDto.hasOwnProperty('scope')) {
        if (getAllDto.scope.includes('categories')) {
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            categories: {
              ...this.prismaService.setCategorySelect(),
              ...this.prismaService.setOrder()
            }
          };
        }

        if (getAllDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (getAllDto.hasOwnProperty('page') && getAllDto.hasOwnProperty('size')) {
        userFindManyArgs = this.prismaService.setPagination(userFindManyArgs, getAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, getOneDto: GetOneDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      }
    });
  }

  async update(request: Request, id: number, updateDto: UpdateDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.update({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      },
      data: updateDto
    });
  }

  async delete(request: Request, id: number): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.delete({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      }
    });
  }
}
