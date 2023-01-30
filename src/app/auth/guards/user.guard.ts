/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UserRelationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const request: Request = httpArgumentsHost.getRequest<Request>();

    const userFindUniqueArgs: Prisma.UserFindUniqueArgs = {
      select: {
        id: true
      },
      where: {
        id: Number((request.params as any).id)
      }
    };

    return from(this.prismaService.user.findUnique(userFindUniqueArgs)).pipe(
      map((user: User) => user.id === (request.user as any).id)
    );
  }
}
