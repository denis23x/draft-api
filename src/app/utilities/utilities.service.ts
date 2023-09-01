/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import * as fs from 'fs';
import sharp, { ResizeOptions, WebpOptions } from 'sharp';
import { readFile } from 'node:fs/promises';
import { parse, ParsedPath } from 'path';

@Injectable()
export class UtilitiesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  async postTestDummy(request: Request, body: any): Promise<any> {
    console.log(body);

    return 'postTestDummy';
  }

  async seedImagesToWebp(): Promise<string> {
    /** https://learnwithparam.com/blog/get-all-files-in-a-folder-using-nodejs/ */

    const getFiles = (dir: string, files: any[] = []): string[] => {
      const fileList: string[] = fs.readdirSync(dir);

      for (const file of fileList) {
        const name: string = `${dir}/${file}`;

        if (fs.statSync(name).isDirectory()) {
          getFiles(name, files);
        } else {
          files.push(name);
        }
      }

      return files;
    };

    const filesInTheFolder: string[] = getFiles('./upload/images/seed/jpg');

    const resizeOptions: ResizeOptions = {
      width: 256,
      height: 256,
      fit: 'cover'
    };

    const webpOptions: WebpOptions = {
      quality: 80,
      effort: 4
    };

    for (const fileName of filesInTheFolder) {
      const buffer: Buffer = await readFile(fileName);

      const fileNameParsed: ParsedPath = parse(fileName);

      await sharp(buffer)
        .resize(resizeOptions)
        .webp(webpOptions)
        .toFile(fileName.replace('jpg', 'webp').replace(fileNameParsed.ext, '.webp'));
    }

    return 'done';
  }
}
