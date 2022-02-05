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
import { AuthService } from './auth.service';
import { LoginDto, AccessTokenDto } from './dto';
import { TransformInterceptor } from '../core';
import { User } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
  IntersectionType
} from '@nestjs/swagger';
import { UserDto } from '../user/dto';

const responseOptions = {
  passthrough: true
};

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** LOGIN */

  @ApiOperation({
    description: '## User authentication'
  })
  @ApiBody({
    type: LoginDto
  })
  @ApiResponse({
    status: 201,
    type: IntersectionType(UserDto, AccessTokenDto)
  })
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async login(
    @Body() loginRequestDto: LoginDto,
    @Res(responseOptions) response: Response
  ): Promise<User> {
    return this.authService.login(loginRequestDto, response);
  }

  /** REFRESH */

  @ApiOperation({
    description: '## Refresh tokens pair'
  })
  @ApiResponse({
    status: 201,
    type: IntersectionType(UserDto, AccessTokenDto)
  })
  @ApiBearerAuth('accessToken')
  @Post('refresh')
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async refresh(@Req() request: Request, @Res(responseOptions) response: Response): Promise<User> {
    return this.authService.refresh(request, response);
  }

  /** ME */

  @ApiOperation({
    description: '## Prove authentication'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @ApiBearerAuth('accessToken')
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  async me(@Req() request: Request): Promise<User> {
    return this.authService.me(request);
  }

  /** SOCIAL AUTHENTICATION */

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async google(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  @UseInterceptors(ClassSerializerInterceptor)
  async googleRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.getSocial(request, response, 'googleId');
  }

  @ApiExcludeEndpoint()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async facebook(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  @UseInterceptors(ClassSerializerInterceptor)
  async facebookRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.getSocial(request, response, 'facebookId');
  }
}
