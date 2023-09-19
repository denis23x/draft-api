/** @format */

import { Injectable, Logger } from '@nestjs/common';
import { join, parse, ParsedPath } from 'path';
import { readFile, unlink } from 'node:fs/promises';
import sharp, { ResizeOptions, WebpOptions } from 'sharp';
import process from 'process';

@Injectable()
export class SharpService {
  private readonly logger: Logger = new Logger(SharpService.name);

  async getSharp(filePath: string): Promise<sharp.Sharp> {
    const buffer: Buffer = await readFile(filePath);

    const resizeOptions: ResizeOptions = {
      width: 256,
      height: 256,
      fit: 'cover'
    };

    const webpOptions: WebpOptions = {
      quality: 80,
      effort: 4
    };

    return sharp(buffer).resize(resizeOptions).webp(webpOptions);
  }

  async getWebpImage(fileName: string): Promise<string> {
    const parsedPath: ParsedPath = parse(fileName);

    const fileTemp: string = join(process.cwd(), 'upload/temp', parsedPath.base);
    const fileWebp: string = fileTemp.replace(parsedPath.ext, '.webp');

    await this.getSharp(fileTemp).then((sharp: sharp.Sharp) => {
      return sharp
        .toFile(fileWebp)
        .then(() => unlink(fileTemp).catch((error: any) => this.logger.error(error)));
    });

    return fileWebp;
  }
}
