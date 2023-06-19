/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordCheckGetDto, PasswordResetGetDto, PasswordResetUpdateDto } from './dto';
import { PrismaService } from '../core';
import { Prisma, User } from '@prisma/client';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  // prettier-ignore
  async getCheck(request: Request, passwordCheckGetDto: PasswordCheckGetDto): Promise<any> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: {
        password: true
      },
      where: {
        id: (request.user as any).id
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

    return {
      valid: await compare(passwordCheckGetDto.password, user.password)
    };
  }

  // prettier-ignore
  async getReset(request: Request, passwordResetGetDto: PasswordResetGetDto): Promise<Partial<User>> {
    const userFindUniqueOrThrowArgs: Prisma.UserFindUniqueOrThrowArgs = {
      select: {
        id: true,
        email: true
      },
      where: {
        email: passwordResetGetDto.email
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
        host: this.configService.get('APP_SITE_ORIGIN'),
        token: await this.jwtService.signAsync({}, {
          expiresIn: Number(this.configService.get('JWT_ACCESS_TTL')),
          subject: String(user.id),
        })
      }
    }).then(() => user);
  }

  // prettier-ignore
  async postReset(request: Request, passwordResetUpdateDto: PasswordResetUpdateDto): Promise<Partial<User>> {
    try {
      const jwtSignOptions: any = await this.jwtService.verifyAsync(passwordResetUpdateDto.token);

      /** Remove all sessions */

      const sessionDeleteManyArgs: Prisma.SessionDeleteManyArgs = {
        where: {
          userId: Number(jwtSignOptions.sub)
        }
      };

      await this.prismaService.session.deleteMany(sessionDeleteManyArgs);

      /** Update user password */

      const userUpdateArgs: Prisma.UserUpdateArgs = {
        select: {
          id: true,
          email: true
        },
        where: {
          id: Number(jwtSignOptions.sub)
        },
        data: {
          password: await hash(passwordResetUpdateDto.password, 10)
        }
      };

      return this.prismaService.user.update(userUpdateArgs).then((user: User) => {
        this.mailerService.sendMail({
          to: user.email,
          subject: 'Your password has been changed',
          template: 'password-changed',
          context: {
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
