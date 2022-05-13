/** @format */

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Upload')
@Controller('Upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
  }

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    // console.log(file);
  }
}
