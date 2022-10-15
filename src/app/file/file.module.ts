/** @format */

import { BadRequestException, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { ErrorBody } from '../core';
import { existsSync, mkdirSync } from 'fs';
import { MulterModuleOptions } from '@nestjs/platform-express/multer/interfaces/files-upload-module.interface';
import * as mime from 'mime-types';
import * as crypto from 'crypto';

@Module({
  imports: [
    HttpModule,
    MulterModule.registerAsync({
      useFactory: async (): Promise<MulterModuleOptions> => ({
        limits: {
          fileSize: 1048576 // 1MB
        },
        fileFilter: (request: Request, file: Express.Multer.File, callback: any): void => {
          const mimeList: string[] = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];

          if (mimeList.includes(file.mimetype)) {
            callback(null, true);
          } else {
            const errorBody: ErrorBody = {
              statusCode: 400,
              message: 'File type is not supported'
            };

            callback(new BadRequestException(errorBody), false);
          }
        },
        storage: diskStorage({
          destination: (request: Request, file: Express.Multer.File, callback: any): void => {
            const buildPath = (path: string): void => {
              if (!existsSync(path)) {
                mkdirSync(path);
              }
            };

            const uploadPath: string = './upload';

            buildPath(uploadPath);

            const uploadPathField: string = [uploadPath, file.fieldname].join('/');

            buildPath(uploadPathField);

            callback(null, uploadPathField);
          },
          filename: function (request: Request, file: Express.Multer.File, callback: any): void {
            callback(null, crypto.randomUUID() + '.' + mime.extension(file.mimetype));
          }
        })
      })
    })
  ],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService]
})
export class FileModule {}
