/** @format */

import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RegistrationDto, AccessTokenDto } from './dto';
import { User } from '@prisma/client';
import { UserDto } from '../user/dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
  IntersectionType
} from '@nestjs/swagger';

const responseOptions = {
  passthrough: true
};

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** LOGIN */

  // prettier-ignore
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
  async login(@Req() request: Request, @Res(responseOptions) response: Response, @Body() loginDto: LoginDto): Promise<User> {
    return this.authService.login(request, response, loginDto);
  }

  /** REGISTRATION */

  // prettier-ignore
  @ApiOperation({
    description: '## User registration'
  })
  @ApiBody({
    type: RegistrationDto
  })
  @ApiResponse({
    status: 201,
    type: IntersectionType(UserDto, AccessTokenDto)
  })
  @Post('registration')
  async registration(@Req() request: Request, @Res(responseOptions) response: Response, @Body() registrationDto: RegistrationDto): Promise<User> {
    return this.authService.registration(request, response, registrationDto);
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
  @UseGuards(JwtAuthGuard)
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
  async facebookRedirect(@Req() request: Request, @Res() response: Response): Promise<void> {
    return this.authService.getSocial(request, response, 'facebookId');
  }
}
