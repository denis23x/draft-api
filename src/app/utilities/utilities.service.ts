/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailConfirmationDto, PasswordResetDto, PasswordSetDto } from './dto';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UtilitiesService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async getEmailConfirmation(request: Request, id: number): Promise<User> {
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
  async postEmailConfirmation(request: Request, emailConfirmationDto: EmailConfirmationDto): Promise<User> {
    try {
      const jwtSignOptions: any = await this.jwtService.verifyAsync(emailConfirmationDto.token);

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

  async getPasswordReset(request: Request, passwordResetDto: PasswordResetDto): Promise<User> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: this.prismaService.setUserSelect(),
      where: {
        email: passwordResetDto.email
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
  async postPasswordReset(request: Request, passwordSetDto: PasswordSetDto): Promise<User> {
    try {
      const jwtSignOptions: any = await this.jwtService.verifyAsync(passwordSetDto.token);

      /** Remove all sessions */

      const sessionDeleteManyArgs: Prisma.SessionDeleteManyArgs = {
        where: {
          userId: Number(jwtSignOptions.sub)
        }
      };

      await this.prismaService.session.deleteMany(sessionDeleteManyArgs);

      /** Update user password */

        // @ts-ignore
      const userUpdateArgs: Prisma.UserUpdateArgs = {
          select: this.prismaService.setUserSelect(),
          where: {
            id: Number(jwtSignOptions.sub)
          },
          data: {
            password: await hash(passwordSetDto.password, 10)
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

  /** DUMMY */

  async postTestDummy(request: Request, body: any): Promise<any> {
    console.log(body);

    return 'Denis';
  }
}
