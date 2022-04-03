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

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  setCategorySelect(): Prisma.CategorySelect {
    return {
      id: true,
      name: true,
      userId: false,
      createdAt: true,
      updatedAt: true,
      deletedAt: false
    };
  }

  setPostSelect(): Prisma.PostSelect {
    return {
      id: true,
      title: true,
      body: true,
      image: true,
      userId: false,
      categoryId: false,
      createdAt: true,
      updatedAt: true,
      deletedAt: false
    };
  }

  setSessionSelect(): Prisma.SessionSelect {
    return {
      id: true,
      userId: false,
      ua: true,
      fingerprint: true,
      ip: true,
      createdAt: true,
      updatedAt: true
    };
  }

  setUserSelect(): Prisma.UserSelect {
    return {
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
    };
  }

  setPagination(dto: any): any {
    const skip: number = (dto.page - 1) * dto.size;
    const take: number = dto.size;

    return {
      skip,
      take
    };
  }
}
