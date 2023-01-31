/** @format */

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from '../../core';
import { Request } from 'express';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class CategoryRelationGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  canActivate(executionContext: ExecutionContext): Observable<boolean> {
    const request: Request = executionContext.switchToHttp().getRequest<Request>();

    const categoryFindUniqueArgs: Prisma.CategoryFindUniqueArgs = {
      select: {
        userId: true
      },
      where: {
        id: Number((request.params as any).id)
      }
    };

    return from(this.prismaService.category.findUnique(categoryFindUniqueArgs)).pipe(
      map((category: Category) => {
        return category.userId === (request.user as any).id;
      })
    );
  }
}
