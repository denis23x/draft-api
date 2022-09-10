/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { FileCreateDto } from './dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService
  ) {}

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

      // TODO: image upload

      console.log(file);
    }

    throw new BadRequestException();
  }

  async createByUrl(request: Request, response: Response, queryParams: any): Promise<any> {
    const axios: any = await this.httpService.axiosRef(queryParams.url, {
      responseType: 'stream'
    });

    response.header(axios.headers);
    response.status(200);

    await axios.data.pipe(response);

    return true;
  }
}
