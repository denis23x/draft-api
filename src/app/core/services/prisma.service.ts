/** @format */

import { Injectable, OnModuleInit, OnModuleDestroy, INestApplication } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super();
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  setCategorySelect(): Prisma.CategorySelect {
    return {
      id: true,
      name: true,
      description: true,
      userId: false,
      createdAt: true,
      updatedAt: true,
      deletedAt: false
    };
  }

  setPostSelect(): Prisma.PostSelect {
    return {
      id: true,
      name: true,
      description: true,
      markdown: true,
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
      refresh: false,
      expires: false,
      ip: true,
      createdAt: true,
      updatedAt: true
    };
  }

  setSettingsSelect(): Prisma.SettingsSelect {
    return {
      id: true,
      theme: true,
      themePrism: true,
      themeBackground: true,
      language: true,
      monospace: true,
      buttons: true,
      createdAt: true,
      updatedAt: true
    };
  }

  setUserSelect(): Prisma.UserSelect {
    return {
      id: true,
      facebookId: false,
      githubId: false,
      googleId: false,
      name: true,
      description: true,
      avatar: true,
      email: true,
      emailConfirmed: true,
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

  setScope(dto: any, args: any): any {
    const scopeMap: any = {
      categories: this.setCategorySelect()
    };

    dto.scope.forEach((scope: string) => {
      args.select = {
        ...args.select,
        [scope]: {
          select: scopeMap[scope],
          orderBy: {
            id: 'desc'
          }
        }
      };
    });

    return args;
  }
}
