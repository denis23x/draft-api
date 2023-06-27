/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmationUpdateDto } from './dto';
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

  async confirmationGet(request: Request): Promise<User> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: {
        id: true,
        email: true,
        emailConfirmed: true
      },
      where: {
        id: (request.user as any).id
      }
    };

    return this.prismaService.user
      .findUniqueOrThrow(userFindUniqueOrThrowArgs)
      .then((user: User) => {
        if (!user.emailConfirmed) {
          // prettier-ignore
          return this.jwtService
            .signAsync({}, {
              expiresIn: Number(this.configService.get('JWT_ACCESS_TTL')),
              subject: String(user.id)
            })
            .then((token: string) => {
              return this.mailerService
                .sendMail({
                  to: user.email,
                  subject: 'Confirm your email address',
                  template: 'email-confirmation',
                  context: {
                    host: this.configService.get('APP_SITE_ORIGIN'),
                    token
                  }
                })
                .then(() => user);
            });
        }

        return user;
      });
  }

  // prettier-ignore
  async confirmationUpdate(request: Request, emailConfirmationUpdateDto: EmailConfirmationUpdateDto): Promise<User> {
    return this.jwtService.verifyAsync(emailConfirmationUpdateDto.token).then((jwtSignOptions: any) => {
      const userUpdateArgs: Prisma.UserUpdateArgs = {
        select: {
          id: true,
          emailConfirmed: true
        },
        where: {
          id: Number(jwtSignOptions.sub)
        },
        data: {
          emailConfirmed: true
        }
      };

      return this.prismaService.user.update(userUpdateArgs);
    });
  }
}
