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

  setNonSensitiveUserSelect(args?: any): any {
    return {
      ...args,
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

  setCategorySelect(args?: any): any {
    return {
      ...args,
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

  setPostSelect(args?: any): any {
    return {
      ...args,
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

  setWhere(args: any, dto: any, key: string): any {
    const getWhere = () => {
      const and: boolean = args.hasOwnProperty('where');
      const exact: boolean = dto.hasOwnProperty('exact') && !!dto.exact;

      const where = {
        [key]: exact
          ? dto[key]
          : {
              contains: dto[key]
            }
      };

      return {
        where: and ? { ...args.where, AND: [where] } : where
      };
    };

    return {
      ...args,
      ...getWhere()
    };
  }

  setOrder(args?: any): any {
    return {
      ...args,
      orderBy: {
        id: 'desc'
      }
    };
  }

  setPagination(args?: any, dto?: any): any {
    const page: number = dto?.page || 1;
    const size: number = dto?.size || 10;

    const skip: number = (page - 1) * size;
    const take: number = size;

    return {
      ...args,
      skip,
      take
    };
  }
}
