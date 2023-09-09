/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Prisma, Session } from '@database/client';

@Injectable()
export class SessionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll(request: Request): Promise<Session[]> {
    const sessionFindManyArgs: Prisma.SessionFindManyArgs = {
      select: this.prismaService.setSessionSelect(),
      where: {
        userId: (request.user as any).id
      },
      orderBy: {
        id: 'desc'
      }
    };

    return this.prismaService.session.findMany(sessionFindManyArgs);
  }

  async delete(request: Request, id: number): Promise<Session> {
    const sessionDeleteArgs: Prisma.SessionDeleteArgs = {
      select: this.prismaService.setSessionSelect(),
      where: {
        id
      }
    };

    return this.prismaService.session.delete(sessionDeleteArgs);
  }
}
