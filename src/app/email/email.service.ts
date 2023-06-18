/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ConfirmationUpdateDto } from './dto';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class EmailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async getConfirmation(request: Request, id: number): Promise<User> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        id
      }
    };

    const user: User = await this.prismaService.user
      .findUniqueOrThrow(userFindUniqueOrThrowArgs)
      .catch((error: Error) => {
        // prettier-ignore
        throw new Prisma.PrismaClientKnownRequestError(error.message, {
          code: 'P2001',
          clientVersion: Prisma.prismaVersion.client
        });
      });

    // prettier-ignore
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your email address',
      template: 'email-confirmation',
      context: {
        user: user,
        host: this.configService.get('APP_SITE_ORIGIN'),
        token: await this.jwtService.signAsync({}, {
          expiresIn: Number(this.configService.get('JWT_ACCESS_TTL')),
          subject: String(user.id)
        })
      }
    }).then(() => user);
  }

  // prettier-ignore
  async postConfirmation(request: Request, confirmationUpdateDto: ConfirmationUpdateDto): Promise<User> {
    try {
      const jwtSignOptions: any = await this.jwtService.verifyAsync(confirmationUpdateDto.token);

      const userUpdateArgs: Prisma.UserUpdateArgs = {
        select: this.prismaService.setUserSelect(),
        where: {
          id: Number(jwtSignOptions.sub)
        },
        data: {
          emailConfirmed: true
        }
      };

      return this.prismaService.user.update(userUpdateArgs);
    } catch (error: any) {
      throw new BadRequestException();
    }
  }
}
