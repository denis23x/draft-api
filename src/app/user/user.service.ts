/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { User } from '@prisma/client';
import { UserGetAllDto, UserGetOneDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(request: Request, userGetAllDto: UserGetAllDto): Promise<User[]> {
    let userFindManyArgs: any = {
      ...this.prismaService.setNonSensitiveUserSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!userGetAllDto) {
      /** Search */

      if (userGetAllDto.hasOwnProperty('name')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, userGetAllDto, 'name');
      }

      if (userGetAllDto.hasOwnProperty('email')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, userGetAllDto, 'email');
      }

      /** Scope */

      if (userGetAllDto.hasOwnProperty('scope')) {
        if (userGetAllDto.scope.includes('categories')) {
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            categories: {
              ...this.prismaService.setCategorySelect(),
              ...this.prismaService.setOrder()
            }
          };
        }

        if (userGetAllDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (userGetAllDto.hasOwnProperty('page') && userGetAllDto.hasOwnProperty('size')) {
        userFindManyArgs = this.prismaService.setPagination(userFindManyArgs, userGetAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, userGetOneDto: UserGetOneDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      }
    });
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.update({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      },
      data: userUpdateDto
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
