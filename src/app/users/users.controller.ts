/** @format */

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { FindAllUsersDto, CreateUserDto, DeleteUserDto, FindOneUserDto } from './users.dto';
import { UpdateResult } from 'typeorm';
import { Request, Response } from 'express';

const responseOptions = {
  passthrough: true
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Query() findAllUsersDto: FindAllUsersDto): Promise<User[]> {
    return this.usersService.findAll(findAllUsersDto);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res(responseOptions) response: Response
  ): Promise<User> {
    return this.usersService.create(createUserDto, response);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async findMe(@Req() request: Request): Promise<User> {
    return this.usersService.findMe(request);
  }

  @Get(':id')
  async findOne(@Param() findOneUserDto: FindOneUserDto): Promise<User> {
    return this.usersService.findOne(findOneUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(
    @Param() deleteUserDto: DeleteUserDto,
    @Req() request: Request
  ): Promise<UpdateResult> {
    return this.usersService.delete(deleteUserDto, request);
  }
}
