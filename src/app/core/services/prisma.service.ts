/** @format */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      rejectOnNotFound: {
        // prettier-ignore
        findUnique: {
          Category: (error: Error) => {
            return new Prisma.PrismaClientKnownRequestError(error.message, 'P2001', Prisma.prismaVersion.client);
          },
          Post: (error: Error) => {
            return new Prisma.PrismaClientKnownRequestError(error.message, 'P2001', Prisma.prismaVersion.client);
          },
          User: (error: Error) => {
            return new Prisma.PrismaClientKnownRequestError(error.message, 'P2001', Prisma.prismaVersion.client);
          }
        }
      }
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  setCategorySelect(): any {
    return {
      select: {
        id: true,
        name: true,
        userId: false,
        createdAt: true,
        updatedAt: true,
        deletedAt: false
      }
    };
  }

  setPostSelect(): any {
    return {
      select: {
        id: true,
        title: true,
        body: true,
        image: true,
        userId: false,
        categoryId: false,
        createdAt: true,
        updatedAt: true,
        deletedAt: false
      }
    };
  }

  setUserSelect(): any {
    return {
      select: {
        id: true,
        googleId: false,
        facebookId: false,
        name: true,
        biography: true,
        avatar: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
        deletedAt: false
      }
    };
  }

  setOrder(): any {
    return {
      orderBy: {
        id: 'desc'
      }
    };
  }

  setPagination(dto?: any): any {
    const page: number = dto?.page || 1;
    const size: number = dto?.size || 10;

    const skip: number = (page - 1) * size;
    const take: number = size;

    return {
      skip,
      take
    };
  }
}
