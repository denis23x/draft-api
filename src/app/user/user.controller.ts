/** @format */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { CreateUserDto, GetAllUserDto, GetOneUserDto, UpdateUserDto } from './user.dto';
import { Request, Response } from 'express';
import { PrismaExceptionFilter } from '../core';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

const responseOptions = {
  passthrough: true
};

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(PrismaExceptionFilter)
  async create(
    @Req() request: Request,
    @Res(responseOptions) response: Response,
    @Body() createUserDto: CreateUserDto
  ): Promise<User> {
    return this.userService.create(request, response, createUserDto);
  }

  @Get()
  async getAll(@Req() request: Request, @Query() getAllUserDto: GetAllUserDto): Promise<User[]> {
    return this.userService.getAll(request, getAllUserDto);
  }

  @Get(':id')
  async getOne(
    @Req() request: Request,
    @Param('id') id: number,
    @Query() getOneUserDto: GetOneUserDto
  ): Promise<User> {
    return this.userService.getOne(request, id, getOneUserDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(PrismaExceptionFilter)
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(request, id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.userService.delete(request, id);
  }
}
