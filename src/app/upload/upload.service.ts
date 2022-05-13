/** @format */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}
}
