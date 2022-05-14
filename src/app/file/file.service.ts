/** @format */

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { FileCreateDto } from './dto';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, fileCreateDto: FileCreateDto): Promise<any> {
    fileCreateDto = Object.assign({}, fileCreateDto);

    if (fileCreateDto.hasOwnProperty('avatar')) {
      const file: Express.Multer.File = fileCreateDto.avatar.pop();

      const userUpdateArgs: Prisma.UserUpdateArgs = {
        select: this.prismaService.setUserSelect(),
        where: {
          id: (request.user as any).id
        },
        data: {
          avatar: process.env.APP_ORIGIN + '/avatar/' + file.filename
        }
      };

      return this.prismaService.user.update(userUpdateArgs);
    }

    if (fileCreateDto.hasOwnProperty('image')) {
      const file: Express.Multer.File = fileCreateDto.image.pop();

      console.log(file);
    }

    throw new BadRequestException();
  }
}
