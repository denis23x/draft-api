/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordGetOneDto, PasswordUpdateDto } from './dto';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async getReset(request: Request, passwordGetOneDto: PasswordGetOneDto): Promise<User> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        email: passwordGetOneDto.email
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
      subject: 'Forgot your password?',
      template: 'password-reset',
      context: {
        user: user,
        host: this.configService.get('APP_SITE_ORIGIN'),
        token: await this.jwtService.signAsync({}, {
          expiresIn: Number(this.configService.get('JWT_ACCESS_TTL')),
          subject: String(user.id),
        })
      }
    }).then(() => user);
  }

  // prettier-ignore
  async postReset(request: Request, passwordUpdateDto: PasswordUpdateDto): Promise<User> {
    try {
      const jwtSignOptions: any = await this.jwtService.verifyAsync(passwordUpdateDto.token);

      /** Remove all sessions */

      const sessionDeleteManyArgs: Prisma.SessionDeleteManyArgs = {
        where: {
          userId: Number(jwtSignOptions.sub)
        }
      };

      await this.prismaService.session.deleteMany(sessionDeleteManyArgs);

      /** Update user password */

      const userUpdateArgs: Prisma.UserUpdateArgs = {
        select: this.prismaService.setUserSelect(),
        where: {
          id: Number(jwtSignOptions.sub)
        },
        data: {
          password: await hash(passwordUpdateDto.password, 10)
        }
      };

      return this.prismaService.user.update(userUpdateArgs).then((user: User) => {
        this.mailerService.sendMail({
          to: user.email,
          subject: 'Your password has been changed',
          template: 'password-changed',
          context: {
            user: user,
            host: this.configService.get('APP_SITE_ORIGIN')
          }
        });

        return user;
      });
    } catch (error: any) {
      throw new BadRequestException();
    }
  }
}
