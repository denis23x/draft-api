/** @format */

import { BadRequestException, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { MulterModuleOptions } from '@nestjs/platform-express/multer/interfaces/files-upload-module.interface';
import * as crypto from 'crypto';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { extension } from 'mime-types';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MulterModule.registerAsync({
      useFactory: async (): Promise<MulterModuleOptions> => ({
        limits: {
          fileSize: 5000000, // 5MB
          files: 1
        },
        fileFilter: (request: Request, file: Express.Multer.File, callback: any): void => {
          const mimeList: string[] = ['image/jpeg', 'image/jpg', 'image/png'];

          if (mimeList.includes(file.mimetype)) {
            callback(null, true);
          } else {
            const errorBody: any = {
              statusCode: 400,
              message: 'File type is not supported'
            };

            callback(new BadRequestException(errorBody), false);
          }
        },
        storage: diskStorage({
          destination: (request: Request, file: Express.Multer.File, callback: any): void => {
            const tempPath: string = join(process.cwd(), 'upload/temp');

            mkdir(tempPath, {
              recursive: true
            }).then(() => callback(null, tempPath));
          },
          filename: (request: Request, file: Express.Multer.File, callback: any): void => {
            callback(null, crypto.randomUUID() + '.' + extension(file.mimetype));
          }
        })
      }),
      imports: [ConfigModule],
      inject: [ConfigService]
    })
  ],
  controllers: [FileController],
  exports: [FileService],
  providers: [FileService]
})
export class FileModule {}
