/** @format */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, parse, ParsedPath } from 'path';
import { readFile, unlink } from 'node:fs/promises';
import sharp, { ResizeOptions, WebpOptions } from 'sharp';

@Injectable()
export class ImageService {
  private readonly logger: Logger = new Logger(ImageService.name);
  private readonly pathImages: string = join(__dirname, '../../../../upload/images');

  constructor(private readonly configService: ConfigService) {}

  // prettier-ignore
  async getWebpImage(fileName: string, filePath: string): Promise<string> {
    const fileNameParsed: ParsedPath = parse(fileName);

    const fileTemp: string = join(this.pathImages, fileName.replace(/.*images/g, ''));
    const fileWebp: string = join(this.pathImages, filePath, fileNameParsed.base.replace(fileNameParsed.ext, '.webp'));

    const buffer: Buffer = await readFile(fileTemp);

    const resizeOptions: ResizeOptions = {
      width: 256,
      height: 256,
      fit: 'cover'
    };

    const webpOptions: WebpOptions = {
      quality: 80,
      effort: 4
    };

    /** Creating Webp version and remove temp file */

    await sharp(buffer)
      .resize(resizeOptions)
      .webp(webpOptions)
      .toFile(fileWebp)
      .then(() => unlink(fileTemp));

    return fileWebp.replace(/.*upload/g, this.configService.get('APP_ORIGIN'));
  }

  async getWebpImageRemove(fileName: string, filePath: string): Promise<void> {
    const fileNameParsed: ParsedPath = parse(fileName);

    const fileWebp: string = join(this.pathImages, filePath, fileNameParsed.base);

    await unlink(fileWebp).catch((error: any) => this.logger.error(error));
  }
}
