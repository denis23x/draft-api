/** @format */

import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { FileDto, FileCreateDto, FileProxyGetOneDto, FileMulterField } from './dto';

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
        avatars: {
          type: 'string',
          format: 'binary',
        },
        images: {
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: FileDto
  })
  @ApiBearerAuth('access')
  @Post()
  @UseInterceptors(FileFieldsInterceptor(FileMulterField))
  @UseGuards(AuthGuard('access'))
  async create(@Req() request: Request, @UploadedFiles() fileCreateDto: FileCreateDto): Promise<Express.Multer.File> {
    return this.uploadService.create(request, fileCreateDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get file'
  })
  @ApiResponse({
    status: 200
  })
  @ApiBearerAuth('access')
  @Get('proxy')
  @UseGuards(AuthGuard('access'))
  async getOne(@Req() request: Request, @Res() response: Response, @Query() fileProxyGetOneDto: FileProxyGetOneDto): Promise<any> {
    return this.uploadService.getOne(request, response, fileProxyGetOneDto);
  }
}
