/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable()
export class PostRelationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const httpArgumentsHost: HttpArgumentsHost = executionContext.switchToHttp();

    const request: Request = httpArgumentsHost.getRequest<Request>();

    const postFindUniqueArgs: Prisma.PostFindUniqueArgs = {
      select: {
        userId: true
      },
      where: {
        id: Number((request.params as any).id)
      }
    };

    return from(this.prismaService.post.findUnique(postFindUniqueArgs)).pipe(
      switchMap((post: Post) => of(post.userId === (request.user as any).id))
    );
  }
}
