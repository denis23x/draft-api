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

const responseOptions = {
  passthrough: true
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() loginDto: LoginDto, @Res(responseOptions) response: Response): Promise<User> {
    return this.authService.login(loginDto, response);
  }

  @Post('refresh')
  @UseInterceptors(ClassSerializerInterceptor)
  async refresh(@Req() request: Request, @Res(responseOptions) response: Response): Promise<User> {
    return this.authService.refresh(request, response);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google(@Req() request: Request): Promise<void> {}

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(ClassSerializerInterceptor)
  async googleRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.social(request, response, 'googleId');
  }

  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebook(@Req() request: Request): Promise<void> {}

  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @UseInterceptors(ClassSerializerInterceptor)
  async facebookRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.social(request, response, 'facebookId');
  }
}
