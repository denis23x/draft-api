/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { UserCreateDto, UserGetAllDto, UserGetOneDto, UserUpdateDto } from './dto';
import { existsSync, unlinkSync } from 'fs';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, userCreateDto: UserCreateDto): Promise<User> {
    const userCreateArgs: Prisma.UserCreateArgs = {
      select: this.prismaService.setUserSelect(),
      data: {
        ...userCreateDto,
        description: "I'm new here",
        settings: {
          create: {
            theme: 'light',
            language: 'en',
            monospace: true,
            buttons: 'left'
          }
        }
      }
    };

    if (userCreateDto.hasOwnProperty('password')) {
      userCreateArgs.data.password = await hash(userCreateDto.password, 10);
    }

    return this.prismaService.user.create(userCreateArgs);
  }

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
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id
      }
    };

    if (!!userGetOneDto) {
      /** Scope */

      if (userGetOneDto.hasOwnProperty('scope')) {
        if (userGetOneDto.scope.includes('categories')) {
          userFindUniqueOrThrowArgs.select = {
            ...userFindUniqueOrThrowArgs.select,
            categories: {
              select: this.prismaService.setCategorySelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (userGetOneDto.scope.includes('posts')) {
          userFindUniqueOrThrowArgs.select = {
            ...userFindUniqueOrThrowArgs.select,
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

    return this.prismaService.user
      .findUniqueOrThrow(userFindUniqueOrThrowArgs)
      .catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, 'P2001', Prisma.prismaVersion.client);
      });
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const userUpdateArgs: Prisma.UserUpdateArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id
      },
      data: userUpdateDto
    };

    if (!!userUpdateDto) {
      /** Update */

      if (userUpdateDto.hasOwnProperty('settings')) {
        userUpdateArgs.select = {
          ...userUpdateArgs.select,
          settings: {
            select: this.prismaService.setSettingsSelect()
          }
        };

        userUpdateArgs.data = {
          ...userUpdateArgs.data,
          settings: {
            update: userUpdateDto.settings
          }
        };
      }

      /** Remove previous avatar */

      if (userUpdateDto.hasOwnProperty('avatar')) {
        const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
          select: {
            avatar: true
          },
          where: {
            id
          }
        };

        await this.prismaService.user.findUnique(userFindUniqueArgs).then((user: User) => {
          const path: string = './upload/avatars/' + user.avatar?.split('/').pop();

          if (existsSync(path)) {
            unlinkSync(path);
          }
        });
      }
    }

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
