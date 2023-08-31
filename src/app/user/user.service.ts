/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService, ImageService } from '../core';
import { Prisma, User } from '@prisma/client';
import { UserCreateDto, UserGetAllDto, UserGetOneDto, UserUpdateDto } from './dto';
import { hash } from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly imageService: ImageService
  ) {}

  async create(request: Request, userCreateDto: UserCreateDto): Promise<User> {
    const userCreateArgs: Prisma.UserCreateArgs = {
      select: this.prismaService.setUserSelect(),
      data: {
        ...userCreateDto,
        settings: {
          create: {}
        }
      }
    };

    if (userCreateDto.hasOwnProperty('password')) {
      userCreateArgs.data = {
        ...userCreateArgs.data,
        password: await hash(userCreateDto.password, 10)
      };
    }

    return this.prismaService.user.create(userCreateArgs).then((user: User) => {
      this.mailerService.sendMail({
        to: user.email,
        subject: 'Thank you for registering with us!',
        template: 'registration',
        context: {
          user: user,
          host: this.configService.get('APP_SITE_ORIGIN')
        }
      });

      return user;
    });
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

      // TODO: remake?

      if (userGetAllDto.hasOwnProperty('name')) {
        userFindManyArgs.where = {
          name: userGetAllDto.name
        };
      }

      /** Fulltext search */

      if (userGetAllDto.hasOwnProperty('query')) {
        userFindManyArgs.where = {
          name: {
            search: userGetAllDto.query + '*'
          }
        };
      }

      /** Order */

      if (userGetAllDto.hasOwnProperty('orderBy')) {
        userFindManyArgs.orderBy = {
          ...userFindManyArgs.orderBy,
          id: userGetAllDto.orderBy === 'newest' ? 'desc' : 'asc'
        };

        /** For full text search make UserOrderByWithRelationAndSearchRelevanceInput[] */

        userFindManyArgs.orderBy = Object.entries(userFindManyArgs.orderBy).map((entry: any) => {
          const key: string = entry[0];
          const value: any = entry[1];

          return {
            [key]: value
          };
        });
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

    return this.prismaService.user.findUniqueOrThrow(userFindUniqueOrThrowArgs);
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const { newPassword, newEmail, avatar, ...userUpdateDtoData } = userUpdateDto;

    const userUpdateArgs: Prisma.UserUpdateArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id
      },
      data: userUpdateDtoData
    };

    /** Get current state for next expressions */

    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        avatar: true,
        email: true,
        password: true
      },
      where: {
        id
      }
    };

    const userCurrent: User = await this.prismaService.user.findUnique(userFindUniqueArgs);

    /** Update sensitive data */

    if (!!newEmail) {
      userUpdateArgs.data = {
        ...userUpdateArgs.data,
        email: newEmail,
        emailConfirmed: false
      };
    }

    if (!!newPassword) {
      userUpdateArgs.data = {
        ...userUpdateArgs.data,
        password: await hash(newPassword, 10)
      };
    }

    /** Update avatar image */

    if (!!avatar) {
      userUpdateArgs.data = {
        ...userUpdateArgs.data,
        avatar: await this.imageService.getWebp(avatar)
      };
    }

    return this.prismaService.user.update(userUpdateArgs).then((user: User) => {
      if (!!newPassword) {
        this.mailerService.sendMail({
          to: user.email,
          subject: 'Your password has been changed',
          template: 'password-changed',
          context: {
            user: user,
            host: this.configService.get('APP_SITE_ORIGIN')
          }
        });
      }

      if (!!newEmail) {
        this.mailerService.sendMail({
          to: [userCurrent.email, user.email],
          subject: 'Your email has been changed',
          template: 'email-changed',
          context: {
            user: user,
            host: this.configService.get('APP_SITE_ORIGIN')
          }
        });
      }

      if (!!avatar) {
        // TODO: complete it
        this.imageService.test(avatar);
      }

      return user;
    });
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
