/** @format */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../users/users.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { TransformInterceptor } from '../core';

const responseOptions = {
  passthrough: true
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async login(@Body() loginDto: LoginDto, @Res(responseOptions) response: Response): Promise<User> {
    return await this.authService.login(loginDto, response);
  }

  @Post('refresh')
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async refresh(@Req() request: Request, @Res(responseOptions) response: Response): Promise<User> {
    return await this.authService.refresh(request, response);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async getGoogle(): Promise<void> {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getGoogleRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return await this.authService.getSocial(request, response, 'googleId');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async getFacebook(): Promise<void> {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getFacebookRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return await this.authService.getSocial(request, response, 'facebookId');
  }
}
