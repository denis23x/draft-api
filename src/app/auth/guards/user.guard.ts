/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../core';
import { Request } from 'express';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UserRelationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const request: Request = executionContext.switchToHttp().getRequest<Request>();

    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: {
        id: true
      },
      where: {
        id: Number((request.params as any).id)
      }
    };

    return from(
      this.prismaService.user.findUniqueOrThrow(userFindUniqueOrThrowArgs).catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, 'P2001', Prisma.prismaVersion.client);
      })
    ).pipe(
      map((user: User) => {
        return user.id === (request.user as any).id;
      })
    );
  }
}
