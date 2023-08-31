/** @format */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join, parse } from 'path';
import { readFile } from 'node:fs/promises';
import { stat, unlink } from 'fs';
import sharp, { ResizeOptions, WebpOptions } from 'sharp';

@Injectable()
export class ImageService {
  constructor(private readonly configService: ConfigService) {}

  // TODO: add log
  // TODO: remove temp
  // TODO: remove previous

  // prettier-ignore
  async getWebp(fileName: string): Promise<string> {
    const fileTemp: string = join(__dirname, '../../../../upload/images/temp', fileName);
    const fileWebp: string = join(__dirname, '../../../../upload/images/user-avatars', fileName.replace(parse(fileName).ext, '.webp'));

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

    await sharp(buffer).resize(resizeOptions).webp(webpOptions).toFile(fileWebp);

    const webpUrl: URL = new URL(this.configService.get('APP_ORIGIN'));

    webpUrl.pathname = join('images/user-avatars', fileName.replace(parse(fileName).ext, '.webp'));

    return webpUrl.href;
  }

  async test(filename: string): Promise<void> {
    const avatar: string = filename?.split('/').pop();
    const avatarPath: string = './upload/avatars/' + avatar;

    stat(avatarPath, (error: NodeJS.ErrnoException | null) => {
      if (!!error) {
        console.log(error);
      } else {
        unlink(avatarPath, (error: NodeJS.ErrnoException | null) => {
          if (!!error) {
            console.log(error);
          }
        });
      }
    });
  }
}
