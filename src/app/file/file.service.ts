/** @format */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request } from 'express';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, file: any): Promise<any> {
    console.log(file);

    // const categoryCreateArgs: Prisma.CategoryCreateArgs = {
    //   select: this.prismaService.setCategorySelect(),
    //   data: {
    //     ...categoryCreateDto,
    //     user: {
    //       connect: {
    //         id: (request.user as any).id
    //       }
    //     }
    //   }
    // };

    // return this.prismaService.category.create(categoryCreateArgs);

    return true;
  }
}
