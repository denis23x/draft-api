/** @format */

import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request, Response } from 'express';
import { FileCreateDto, FileGetOneDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async create(request: Request, fileCreateDto: FileCreateDto): Promise<Express.Multer.File> {
    fileCreateDto = { ...fileCreateDto };

    if (fileCreateDto.hasOwnProperty('avatars') || fileCreateDto.hasOwnProperty('images')) {
      const file: Express.Multer.File = (fileCreateDto.avatars || fileCreateDto.images).pop();

      return {
        ...file,
        path: file.path.replace('upload', process.env.APP_ORIGIN)
      };
    }

    throw new BadRequestException();
  }

  async getOne(request: Request, response: Response, fileGetOneDto: FileGetOneDto): Promise<void> {
    return this.httpService
      .axiosRef({
        url: fileGetOneDto.url,
        method: 'GET',
        responseType: 'stream'
      })
      .then((axiosResponse: AxiosResponse) => {
        response.status(axiosResponse.status);
        response.header({
          ...axiosResponse.headers,
          'access-control-allow-origin': process.env.APP_SITE_ORIGIN
        });

        axiosResponse.data.pipe(response);
      })
      .catch((axiosError: AxiosError) => {
        const { status, statusText }: any = axiosError.response;

        throw new HttpException(statusText, status);
      });
  }
}
