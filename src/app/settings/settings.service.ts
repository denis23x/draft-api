/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SettingsUpdateDto } from './dto';
import { PrismaService } from '../core';
import { Prisma, Settings } from '@prisma/client';

@Injectable()
export class SettingsService {
  constructor(private readonly prismaService: PrismaService) {}

  async confirmationGet(request: Request): Promise<Settings> {
    const settingsFindUniqueOrThrowArgs: Prisma.SettingsFindUniqueOrThrowArgs = {
      select: this.prismaService.setSettingsSelect(),
      where: {
        userId: (request.user as any).id
      }
    };

    return this.prismaService.settings.findUniqueOrThrow(settingsFindUniqueOrThrowArgs);
  }

  // prettier-ignore
  async confirmationUpdate(request: Request, settingsUpdateDto: SettingsUpdateDto): Promise<Settings> {
    const settingsUpdateArgs: Prisma.SettingsUpdateArgs = {
      select: this.prismaService.setSettingsSelect(),
      where: {
        userId: (request.user as any).id
      },
      data: settingsUpdateDto
    };

    return this.prismaService.settings.update(settingsUpdateArgs);
  }
}
