/** @format */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { UserCreateDto, UserGetAllDto, UserGetOneDto, UserUpdateDto } from './dto';
import { compare, hash } from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { stat, unlink } from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService
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

        if (userGetOneDto.scope.includes('sessions')) {
          userFindUniqueOrThrowArgs.select = {
            ...userFindUniqueOrThrowArgs.select,
            sessions: {
              select: this.prismaService.setSessionSelect(),
              orderBy: {
                id: 'desc'
              }
            }
          };
        }

        if (userGetOneDto.scope.includes('settings')) {
          userFindUniqueOrThrowArgs.select = {
            ...userFindUniqueOrThrowArgs.select,
            settings: {
              select: this.prismaService.setSettingsSelect()
            }
          };
        }
      }
    }

    return this.prismaService.user
      .findUniqueOrThrow(userFindUniqueOrThrowArgs)
      .catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, {
          code: 'P2001',
          clientVersion: Prisma.prismaVersion.client
        });
      });
  }

  async update(request: Request, id: number, userUpdateDto: UserUpdateDto): Promise<User> {
    const { password, newPassword, newEmail, ...userUpdateDtoData } = userUpdateDto;

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

    if (!!password) {
      const isAuthenticated: boolean = await compare(password, userCurrent.password);

      if (isAuthenticated) {
        if (!!newEmail) {
          userUpdateArgs.data = {
            ...userUpdateArgs.data,
            email: newEmail
          };
        }

        if (!!newPassword) {
          userUpdateArgs.data = {
            ...userUpdateArgs.data,
            password: await hash(newPassword, 10)
          };
        }
      } else {
        throw new ForbiddenException();
      }
    }

    /** Update settings */

    if (userUpdateDtoData.hasOwnProperty('settings')) {
      userUpdateArgs.select = {
        ...userUpdateArgs.select,
        settings: {
          select: this.prismaService.setSettingsSelect()
        }
      };

      userUpdateArgs.data = {
        ...userUpdateArgs.data,
        settings: {
          update: userUpdateDtoData.settings
        }
      };
    }

    return this.prismaService.user.update(userUpdateArgs).then((user: User) => {
      if (userUpdateDtoData.hasOwnProperty('avatar')) {
        const avatar: string = userCurrent.avatar?.split('/').pop();
        const avatarPath: string = './upload/avatars/' + avatar;

        stat(avatarPath, (error: NodeJS.ErrnoException | null) => {
          if (!!error) {
            console.log(error);
          } else {
            unlink(avatarPath, (error: NodeJS.ErrnoException | null) => {
              if (!!error) {
                console.log(error);
              }
            });
          }
        });
      }

      if (!!newPassword) {
        this.mailerService.sendMail({
          to: user.email,
          subject: 'Your password has been changed',
          template: 'changed-password',
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
          template: 'changed-email',
          context: {
            user: user,
            host: this.configService.get('APP_SITE_ORIGIN')
          }
        });
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
