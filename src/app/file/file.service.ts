/** @format */

import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request, Response } from 'express';
import { FileProxyGetOneDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService
  ) {}

  // prettier-ignore
  async create(request: Request, file: Express.Multer.File): Promise<Express.Multer.File> {
    return {
      ...file,
      path: file.path.replace('upload', this.configService.get('APP_ORIGIN'))
    };
  }

  // prettier-ignore
  async proxyGet(request: Request, response: Response, fileProxyGetOneDto: FileProxyGetOneDto): Promise<any> {
    return this.httpService
      .axiosRef({
        url: fileProxyGetOneDto.url,
        method: 'GET',
        responseType: 'stream'
      })
      .then((axiosResponse: any) => {
        response.status(axiosResponse.status);
        response.header({
          ...axiosResponse.headers,
          'access-control-allow-origin': this.configService.get('APP_SITE_ORIGIN')
        });

        axiosResponse.data.pipe(response);
      })
      .catch((axiosError: any) => {
        const { status, statusText }: any = axiosError.response;

        throw new HttpException(statusText, status);
      });
  }
}
