/** @format */

import { Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AuthGuard } from '@nestjs/passport';

export interface MulterFiles {
  [key: string]: Express.Multer.File[];
}

export const multerField: MulterField[] = [
  {
    name: 'avatar',
    maxCount: 1
  },
  {
    name: 'image',
    maxCount: 1
  }
];

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly uploadService: FileService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Upload file'
  })
  @ApiResponse({
    status: 201,
    type: null
  })
  @ApiBearerAuth('accessToken')
  @Post()
  @UseInterceptors(FileFieldsInterceptor(multerField))
  @UseGuards(AuthGuard('custom'))
  async uploadFile(@Req() request: Request, @UploadedFiles() multerFiles: MulterFiles): Promise<any> {
    return this.uploadService.create(request, multerFiles);
  }
}
