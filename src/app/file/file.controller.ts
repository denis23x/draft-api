/** @format */

import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileService } from './file.service';
import { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FileDto, FileProxyGetOneDto } from './dto';
import { ParseFileOptions } from '@nestjs/common/pipes/file/parse-file-options.interface';

export const parseFileOptions: ParseFileOptions = {
  validators: [
    new FileTypeValidator({
      fileType: '.(png|jpeg|jpg)'
    }),
    new MaxFileSizeValidator({
      maxSize: 5000000
    })
  ],
  fileIsRequired: true
};

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
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          format: 'binary'
        }
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: FileDto
  })
  @ApiBearerAuth('access')
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(AuthGuard('access'))
  async create(@Req() request: Request, @UploadedFile(new ParseFilePipe(parseFileOptions)) file: Express.Multer.File): Promise<Express.Multer.File> {
    return this.uploadService.create(request, file);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get file from internet'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('image/proxy')
  @UseGuards(AuthGuard('access'))
  async proxyGet(@Req() request: Request, @Res() response: Response, @Query() fileProxyGetOneDto: FileProxyGetOneDto): Promise<any> {
    return this.uploadService.proxyGet(request, response, fileProxyGetOneDto);
  }
}
