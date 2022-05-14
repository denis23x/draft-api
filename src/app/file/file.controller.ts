/** @format */

import { Controller, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AuthGuard } from '@nestjs/passport';
import { FileCreateDto, FileDto } from './dto';

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
    description: '## Create file'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...(() => {
          const inputList: any = {};

          multerField.forEach((multerField: MulterField) => {
            inputList[multerField.name] = {
              type: 'string',
              format: 'binary',
            }
          })

          return inputList;
        })()
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: FileDto
  })
  @ApiBearerAuth('accessToken')
  @Post()
  @UseInterceptors(FileFieldsInterceptor(multerField))
  @UseGuards(AuthGuard('custom'))
  async uploadFile(@Req() request: Request, @UploadedFiles() fileCreateDto: FileCreateDto): Promise<any> {
    return this.uploadService.create(request, fileCreateDto);
  }
}
