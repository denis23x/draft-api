/** @format */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile, rename, unlink } from 'node:fs/promises';
import { join, parse, ParsedPath } from 'path';
import { Bucket, Storage } from '@google-cloud/storage';
import process from 'process';

@Injectable()
export class BucketService {
  private readonly logger: Logger = new Logger(BucketService.name);

  private readonly storage: Storage = new Storage();
  private readonly storageBucketName: string = 'draft-api-bucket';
  private readonly storageOrigin: string = 'https:/storage.googleapis.com';

  constructor(private readonly configService: ConfigService) {}

  async setUpload(filePath: string, fileDestination: string): Promise<string> {
    const parsedPath: ParsedPath = parse(filePath);

    if (this.configService.get('APP_ENV') === 'cloud') {
      return this.setUploadToBucket(parsedPath, fileDestination);
    }

    return this.setUploadToDisk(parsedPath, fileDestination);
  }

  async setUploadToDisk(parsedPath: ParsedPath, fileDestination: string): Promise<string> {
    const diskDestination: string = join(process.cwd(), 'upload', fileDestination, parsedPath.base);

    return rename(join(parsedPath.dir, parsedPath.base), diskDestination).then(() => {
      return diskDestination.replace(/.*upload/g, this.configService.get('APP_ORIGIN'));
    });
  }

  async setUploadToBucket(parsedPath: ParsedPath, fileDestination: string): Promise<string> {
    const bufferPath: string = join(parsedPath.dir, parsedPath.base);
    const buffer: Buffer = await readFile(bufferPath);

    const bucket: Bucket = this.storage.bucket(this.storageBucketName);
    const bucketDestination: string = join('upload', fileDestination, parsedPath.base);

    return bucket
      .file(bucketDestination)
      .save(buffer)
      .then(() => {
        return unlink(bufferPath).then(() => {
          return join(this.storageOrigin, this.storageBucketName, bucketDestination);
        });
      });
  }

  async setDelete(filePath: string, fileDestination: string): Promise<void> {
    const parsedPath: ParsedPath = parse(filePath);

    if (this.configService.get('APP_ENV') === 'cloud') {
      return this.setDeleteFromBucket(parsedPath, fileDestination);
    }

    return this.setDeleteFromDisk(parsedPath, fileDestination);
  }

  async setDeleteFromDisk(parsedPath: ParsedPath, fileDestination: string): Promise<void> {
    const destination: string = join(process.cwd(), 'upload', fileDestination, parsedPath.base);

    await unlink(destination).catch((error: any) => this.logger.error(error));
  }

  async setDeleteFromBucket(parsedPath: ParsedPath, fileDestination: string): Promise<any> {
    const bucket: Bucket = this.storage.bucket(this.storageBucketName);
    const bucketDestination: string = join('upload', fileDestination, parsedPath.base);

    return bucket
      .file(bucketDestination)
      .exists()
      .then((existsList: boolean[]) => {
        if (existsList.every((exists: boolean) => exists)) {
          bucket
            .file(bucketDestination)
            .delete()
            .catch((error: any) => this.logger.error(error));
        }
      });
  }
}
