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
      ...this.prismaService.setUserSelect(),
      ...this.prismaService.setOrder()
      // ...this.prismaService.setPagination()
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
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            posts: {
              ...this.prismaService.setPostSelect(),
              ...this.prismaService.setOrder()
            }
          };
        }
      }

      /** Pagination */

      if (userGetAllDto.hasOwnProperty('page') && userGetAllDto.hasOwnProperty('size')) {
        // userFindManyArgs = this.prismaService.setPagination(userFindManyArgs, userGetAllDto);
      }
    }

    // @ts-ignore
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, userGetOneDto: UserGetOneDto): Promise<User> {
    let userFindUniqueArgs: any = {
      ...this.prismaService.setUserSelect(),
      where: {
        id
      }
    };

    if (!!userGetOneDto) {
      /** Scope */

      if (userGetOneDto.hasOwnProperty('scope')) {
        if (userGetOneDto.scope.includes('categories')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            categories: {
              ...this.prismaService.setCategorySelect(),
              ...this.prismaService.setOrder()
            }
          };
        }

        if (userGetOneDto.scope.includes('posts')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            posts: {
              ...this.prismaService.setPostSelect(),
              ...this.prismaService.setOrder()
            }
          };
        }
      }
    }

    // @ts-ignore
    return this.prismaService.user.findUnique(userFindOneArgs);
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.update({
      ...this.prismaService.setUserSelect(),
      where: {
        id
      },
      data: userUpdateDto
    });
  }

  async delete(request: Request, id: number): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.delete({
      ...this.prismaService.setUserSelect(),
      where: {
        id
      }
    });
  }
}
