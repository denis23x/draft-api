/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { UserGetAllDto, UserGetOneDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(request: Request, userGetAllDto: UserGetAllDto): Promise<User[]> {
    const userFindManyArgs: Prisma.UserFindManyArgs = {
      ...this.prismaService.setUserSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!userGetAllDto) {
      /** Search */

      if (userGetAllDto.hasOwnProperty('name')) {
        userFindManyArgs.where = {
          name: {
            contains: userGetAllDto.name
          }
        };
      }

      if (userGetAllDto.hasOwnProperty('email')) {
        userFindManyArgs.where = {
          ...userFindManyArgs.where,
          email: {
            contains: userGetAllDto.email
          }
        };
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
        const { skip, take } = this.prismaService.setPagination(userGetAllDto);

        userFindManyArgs.skip = skip;
        userFindManyArgs.take = take;
      }
    }

    // @ts-ignore
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, userGetOneDto: UserGetOneDto): Promise<User> {
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
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
    const userUpdateArgs: Prisma.UserUpdateArgs = {
      ...this.prismaService.setUserSelect(),
      where: {
        id
      },
      data: userUpdateDto
    };

    // @ts-ignore
    return this.prismaService.user.update(userUpdateArgs);
  }

  async delete(request: Request, id: number): Promise<User> {
    const userDeleteArgs: Prisma.UserDeleteArgs = {
      ...this.prismaService.setUserSelect(),
      where: {
        id
      }
    };

    // @ts-ignore
    return this.prismaService.user.delete(userDeleteArgs);
  }
}
