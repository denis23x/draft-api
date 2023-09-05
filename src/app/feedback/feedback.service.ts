/** @format */

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../core';
import { Feedback, Prisma } from '../../database/client';
import { FeedbackCreateDto } from './dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService
  ) {}

  async create(request: Request, feedbackCreateDto: FeedbackCreateDto): Promise<Feedback> {
    const feedbackCreateArgs: Prisma.FeedbackCreateArgs = {
      select: this.prismaService.setFeedbackSelect(),
      data: {
        ...feedbackCreateDto,
        user: {
          connect: {
            id: (request.user as any).id
          }
        }
      }
    };

    return this.prismaService.feedback.create(feedbackCreateArgs).then((feedback: Feedback) => {
      return this.mailerService
        .sendMail({
          to: this.configService.get('APP_MAIL'),
          subject: 'Valuable insights await you!',
          template: 'feedback',
          context: {
            host: this.configService.get('APP_SITE_ORIGIN'),
            feedback
          }
        })
        .then(() => feedback);
    });
  }
}
