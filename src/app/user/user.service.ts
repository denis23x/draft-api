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
      select: this.prismaService.setUserSelect(),
      orderBy: {
        id: 'desc'
      },
      skip: 0,
      take: 10
    };

    if (!!userGetAllDto) {
      /** Search */

      if (userGetAllDto.hasOwnProperty('name')) {
        if (userGetAllDto.hasOwnProperty('exact')) {
          userFindManyArgs.where = {
            name: userGetAllDto.name
          };
        } else {
          userFindManyArgs.where = {
            name: {
              contains: userGetAllDto.name
            }
          };
        }
      }

      /** Scope */

      if (userGetAllDto.hasOwnProperty('scope')) {
        if (userGetAllDto.scope.includes('categories')) {
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            categories: {
              select: this.prismaService.setCategorySelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (userGetAllDto.scope.includes('posts')) {
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            posts: {
              select: this.prismaService.setPostSelect(),
              orderBy: {
                id: 'desc'
              }
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

    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, userGetOneDto: UserGetOneDto): Promise<User> {
    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: this.prismaService.setUserSelect(),
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
              select: this.prismaService.setCategorySelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (userGetOneDto.scope.includes('posts')) {
          userFindUniqueArgs.select = {
            ...userFindUniqueArgs.select,
            posts: {
              select: this.prismaService.setPostSelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }
      }
    }

    return this.prismaService.user.findUnique(userFindUniqueArgs);
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const userUpdateArgs: Prisma.UserUpdateArgs = {
      select: {
        ...this.prismaService.setUserSelect(),
        settings: {
          select: this.prismaService.setSettingsSelect()
        }
      },
      where: {
        id
      },
      data: userUpdateDto
    };

    return this.prismaService.user.update(userUpdateArgs);
  }

  async delete(request: Request, id: number): Promise<User> {
    const userDeleteArgs: Prisma.UserDeleteArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id
      }
    };

    return this.prismaService.user.delete(userDeleteArgs);
  }
}
