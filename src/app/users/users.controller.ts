/** @format */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { Request, Response } from 'express';
import { IdentifierDto } from '../core';

const responseOptions = {
  passthrough: true
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async createOne(
    @Body() createDto: CreateDto,
    @Res(responseOptions) response: Response
  ): Promise<User> {
    return await this.usersService.createOne(createDto, response);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@Req() request: Request, @Query() getOneDto: GetOneDto): Promise<User> {
    return await this.usersService.getProfile(request, getOneDto);
  }

  @Get()
  async getAll(@Query() getAllDto: GetAllDto): Promise<User | User[]> {
    return await this.usersService.getAll(getAllDto);
  }

  @Get(':id')
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<User> {
    return await this.usersService.getOne(identifierDto, getOneDto);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProfile(@Body() updateDto: UpdateDto, @Req() request: Request): Promise<User> {
    return await this.usersService.updateProfile(updateDto, request);
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  async deleteProfile(@Req() request: Request): Promise<User> {
    return await this.usersService.deleteProfile(request);
  }
}
