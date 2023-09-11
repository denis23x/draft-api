/** @format */

import { HttpException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../core';
import { Request, Response } from 'express';
import { FileGetOneDto, FileGetOneProxyDto } from './dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { createReadStream, ReadStream } from 'fs';
import { stat } from 'fs/promises';
import { contentType } from 'mime-types';

@Injectable()
export class FileService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService
  ) {}

  async create(request: Request, file: Express.Multer.File): Promise<Partial<Express.Multer.File>> {
    const { filename, mimetype, path } = file;

    const absolutePath: string = path.replace('upload', this.configService.get('APP_ORIGIN'));

    return {
      mimetype,
      filename,
      path: absolutePath
    };
  }

  // prettier-ignore
  async getOne(request: Request, response: Response, fileGetOneDto: FileGetOneDto): Promise<StreamableFile> {
    const tempPath: string = '../../../upload/images/temp';

    const fileMime: string | false = contentType(fileGetOneDto.filename);
    const filePath: string = [tempPath, fileGetOneDto.filename].join('/');

    return stat(join(__dirname, filePath))
      .then(() => {
        const readStream: ReadStream = createReadStream(join(__dirname, filePath));

        response.set({
          'Content-Type': fileMime,
          'Content-Disposition': 'attachment; filename="' + fileGetOneDto.filename + '"'
        });

        return new StreamableFile(readStream);
      })
      .catch(() => {
        throw new NotFoundException();
      });
  }

  // prettier-ignore
  async getOneProxy(request: Request, response: Response, fileGetOneProxyDto: FileGetOneProxyDto): Promise<any> {
    return this.httpService
      .axiosRef({
        url: fileGetOneProxyDto.url,
        method: 'GET',
        responseType: 'stream'
      })
      .then((axiosResponse: any) => {
        response.status(axiosResponse.status);
        response.header({
          ...axiosResponse.headers,
          'access-control-allow-origin': this.configService.get('APP_ORIGIN_FRONTEND')
        });

        axiosResponse.data.pipe(response);
      })
      .catch((axiosError: any) => {
        throw new HttpException(axiosError.response.statusText, axiosError.response.status);
      });
  }
}
