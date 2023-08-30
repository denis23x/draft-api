/** @format */

import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Request } from 'express';
import { MulterModuleOptions } from '@nestjs/platform-express/multer/interfaces/files-upload-module.interface';
import * as crypto from 'crypto';
import { ConfigModule } from '@nestjs/config';
import { parse } from 'path';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MulterModule.registerAsync({
      useFactory: async (): Promise<MulterModuleOptions> => ({
        storage: diskStorage({
          destination: (request: Request, file: Express.Multer.File, callback: any): void => {
            callback(null, './upload/images/temp');
          },
          filename: (request: Request, file: Express.Multer.File, callback: any): void => {
            callback(null, crypto.randomUUID() + parse(file.originalname).ext);
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
