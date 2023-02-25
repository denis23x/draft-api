/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Category, Post, Prisma } from '@prisma/client';
import { PrismaService } from '../../core';
import { Request } from 'express';
import { from, Observable, forkJoin, map } from 'rxjs';

@Injectable()
export class PostRelationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const request: Request = executionContext.switchToHttp().getRequest<Request>();

    const postFindUniqueOrThrowArgs: Prisma.PostFindUniqueOrThrowArgs = {
      select: {
        userId: true
      },
      where: {
        id: Number((request.params as any).id)
      }
    };

    const forkJoinList: Observable<Post | Category>[] = [
      from(
        this.prismaService.post
          .findUniqueOrThrow(postFindUniqueOrThrowArgs)
          .catch((error: Error) => {
            // prettier-ignore
            throw new Prisma.PrismaClientKnownRequestError(error.message, {
              code: 'P2001',
              clientVersion: Prisma.prismaVersion.client
            });
          })
      )
    ];

    /** Avoid unnecessary category relation change */

    if ('categoryId' in request.body) {
      const categoryFindUniqueOrThrowArgs: Prisma.CategoryFindUniqueOrThrowArgs = {
        select: {
          userId: true
        },
        where: {
          id: (request.body as any).categoryId
        }
      };

      forkJoinList.push(
        from(
          this.prismaService.category
            .findUniqueOrThrow(categoryFindUniqueOrThrowArgs)
            .catch((error: Error) => {
              // prettier-ignore
              throw new Prisma.PrismaClientKnownRequestError(error.message, {
                code: 'P2001',
                clientVersion: Prisma.prismaVersion.client
              });
            })
        )
      );
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
