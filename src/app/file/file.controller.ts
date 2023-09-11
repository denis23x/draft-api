/** @format */

import {
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  StreamableFile,
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
import { FileDto, FileGetOneDto, FileGetOneProxyDto } from './dto';
import { ParseFileOptions } from '@nestjs/common/pipes/file/parse-file-options.interface';
import { ResponseDecoratorOptions } from '@nestjs/common/decorators/http/route-params.decorator';

export const responseOptions: ResponseDecoratorOptions = {
  passthrough: true
};

export const parseFileOptions: ParseFileOptions = {
  fileIsRequired: true
};

@ApiTags('Files')
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

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
  async create(@Req() request: Request, @UploadedFile(new ParseFilePipe(parseFileOptions)) file: Express.Multer.File): Promise<Partial<Express.Multer.File>> {
    return this.fileService.create(request, file);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get file'
  })
  @ApiResponse({
    status: 200,
    type: StreamableFile
  })
  @ApiBearerAuth('access')
  @Get('image')
  @UseGuards(AuthGuard('access'))
  async getOne(@Req() request: Request, @Res(responseOptions) response: Response, @Query() fileGetOneDto: FileGetOneDto): Promise<StreamableFile> {
    return this.fileService.getOne(request, response, fileGetOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get file from internet'
  })
  @ApiResponse({
    status: 200,
    type: StreamableFile
  })
  @ApiBearerAuth('access')
  @Get('image/proxy')
  @UseGuards(AuthGuard('access'))
  async getOneProxy(@Req() request: Request, @Res() response: Response, @Query() fileGetOneProxyDto: FileGetOneProxyDto): Promise<any> {
    return this.fileService.getOneProxy(request, response, fileGetOneProxyDto);
  }
}
