/** @format */

import { BadRequestException, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { ErrorBody } from '../core';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        limits: {
          fileSize: 1048576 // 1MB
        },
        fileFilter: (request: Request, file: Express.Multer.File, callback: any) => {
          const mimeTypeList: string[] = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];

          if (mimeTypeList.includes(file.mimetype)) {
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
          destination: (request: Request, file: Express.Multer.File, callback: any) => {
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
          filename: function (request: Request, file: Express.Multer.File, callback: any) {
            const uniqueSuffix: string = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension: string = path.extname(file.originalname);

            callback(null, file.fieldname + '-' + uniqueSuffix + extension);
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
