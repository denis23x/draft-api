/** @format */

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, LogoutDto, TokenDto, FingerprintDto } from './dto';
import { User } from '@prisma/client';
import { UserDto } from '../user/dto';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
  IntersectionType
} from '@nestjs/swagger';

export const responseOptions = {
  passthrough: true
};

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // prettier-ignore
  @ApiOperation({
    description: '## Auth login'
  })
  @ApiResponse({
    status: 201,
    type: IntersectionType(UserDto, TokenDto)
  })
  @Post('login')
  async login(@Req() request: Request, @Res(responseOptions) response: Response, @Body() loginDto: LoginDto): Promise<User> {
    return this.authService.login(request, response, loginDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Auth logout'
  })
  @ApiResponse({
    status: 201,
    type: UserDto
  })
  @ApiBearerAuth('accessToken')
  @Post('logout')
  @UseGuards(AuthGuard('custom'))
  async logout(@Req() request: Request, @Res(responseOptions) response: Response, @Body() logoutDto: LogoutDto): Promise<User> {
    return this.authService.logout(request, response, logoutDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Auth refresh'
  })
  @ApiResponse({
    status: 201,
    type: IntersectionType(UserDto, TokenDto)
  })
  @Post('refresh')
  async refresh(@Req() request: Request, @Res(responseOptions) response: Response, @Body() fingerprintDto: FingerprintDto): Promise<User> {
    return this.authService.refresh(request, response, fingerprintDto);
  }

  /** SOCIAL */

  @ApiExcludeEndpoint()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async facebook(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.social(request, response, 'facebookId');
  }

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async google(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.social(request, response, 'googleId');
  }

  @ApiExcludeEndpoint()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async github(): Promise<void> {}

  @ApiExcludeEndpoint()
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.social(request, response, 'githubId');
  }
}
