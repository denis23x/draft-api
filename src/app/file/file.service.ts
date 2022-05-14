/** @format */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request } from 'express';
import { Prisma } from '@prisma/client';
import { FileCreateDto } from './dto';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(request: Request, fileCreateDto: FileCreateDto): Promise<any> {
    if (Object.assign({}, fileCreateDto).hasOwnProperty('avatar')) {
      const file: Express.Multer.File = fileCreateDto.avatar.pop();
    }
  }
}
