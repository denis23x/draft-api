/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Category, Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface';
import { Request } from 'express';
import { from, Observable, forkJoin, map } from 'rxjs';

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

    const forkJoinList: Observable<Post | Category>[] = [
      from(this.prismaService.post.findUnique(postFindUniqueArgs))
    ];

    /** Avoid unnecessary category relation change */

    if ('categoryId' in request.body) {
      const categoryFindUniqueArgs: Prisma.CategoryFindUniqueArgs = {
        select: {
          userId: true
        },
        where: {
          id: (request.body as any).categoryId
        }
      };

      forkJoinList.push(from(this.prismaService.category.findUnique(categoryFindUniqueArgs)));
    }

    // prettier-ignore
    return forkJoin(forkJoinList).pipe(
      map(([post, category]: [Post, Category]) => {
        const postRelation: boolean = post.userId === (request.user as any).id;
        const categoryRelation: boolean = category ? category.userId === (request.user as any).id : true;

        return postRelation && categoryRelation;
      })
    );
  }
}
