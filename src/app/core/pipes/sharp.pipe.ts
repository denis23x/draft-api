/** @format */

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { parse, ParsedPath } from 'path';
import { FileCreateDto } from '../../file/dto';
import sharp, { ResizeOptions, WebpOptions } from 'sharp';

@Injectable()
export class SharpPipe implements PipeTransform {
  async transform(fileCreateDto: FileCreateDto): Promise<FileCreateDto> {
    fileCreateDto = { ...fileCreateDto };

    if (fileCreateDto.hasOwnProperty('avatars') || fileCreateDto.hasOwnProperty('images')) {
      const file: Express.Multer.File = (fileCreateDto.avatars || fileCreateDto.images).pop();
      const fileParsedPath: ParsedPath = parse(file.filename);

      const newFilename: string = fileParsedPath.name + '.webp';
      const newPath: string = file.path.replace(fileParsedPath.base, newFilename);

      const resizeOptions: ResizeOptions = {
        width: 256,
        height: 256,
        fit: 'cover'
      };

      const webpOptions: WebpOptions = {
        quality: 80,
        effort: 4
      };

      /** Webp */

      await sharp(file.path).resize(resizeOptions).webp(webpOptions).toFile(newPath);

      return {
        avatars: [
          {
            ...file,
            filename: newFilename,
            path: newPath
          }
        ]
      };
    }

    throw new BadRequestException();
  }
}
