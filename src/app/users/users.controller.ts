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
  async create(
    @Body() createDto: CreateDto,
    @Res(responseOptions) response: Response
  ): Promise<User> {
    return await this.usersService.create(createDto, response);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Req() request: Request, @Query() getOneDto: GetOneDto): Promise<User> {
    return await this.usersService.getMe(request, getOneDto);
  }

  @Get()
  async getAll(@Query() getAllDto: GetAllDto): Promise<User[]> {
    return await this.usersService.getAll(getAllDto);
  }

  @Get(':id')
  async getOne(
    @Param() identifierDto: IdentifierDto,
    @Query() getOneDto: GetOneDto
  ): Promise<User> {
    return await this.usersService.getOne(identifierDto, getOneDto);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(@Body() updateDto: UpdateDto, @Req() request: Request): Promise<User> {
    return await this.usersService.update(updateDto, request);
  }

  @Delete('me')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request): Promise<User> {
    return await this.usersService.delete(request);
  }
}
