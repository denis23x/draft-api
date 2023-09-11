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
import { parse } from 'path';
import MulterGoogleCloudStorage from 'multer-cloud-storage';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MulterModule.registerAsync({
      useFactory: async (configService: ConfigService): Promise<MulterModuleOptions> => ({
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
        storage: (() => {
          const storageOptions: any = {
            destination: (request: Request, file: Express.Multer.File, callback: any): void => {
              callback(null, './upload/images/temp');
            },
            filename: (request: Request, file: Express.Multer.File, callback: any): void => {
              callback(null, crypto.randomUUID() + parse(file.originalname).ext);
            }
          };

          const storageMap: any = {
            cloud: new MulterGoogleCloudStorage(storageOptions),
            local: diskStorage(storageOptions)
          };

          return storageMap[configService.get('APP_ENV')];
        })()
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
