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
import { FindAllDto, CreateDto, FindOneByIdDto } from './users.dto';
import { UpdateResult } from 'typeorm';
import { Request, Response } from 'express';

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
    return this.usersService.create(createDto, response);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async findMe(@Req() request: Request): Promise<User> {
    return this.usersService.findMe(request);
  }

  @Get()
  async findAll(@Query() findAllDto: FindAllDto): Promise<User[]> {
    return this.usersService.findAll(findAllDto);
  }

  @Get(':id')
  async findOneById(@Param() findOneByIdDto: FindOneByIdDto): Promise<User> {
    return this.usersService.findOneById(findOneByIdDto);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request): Promise<UpdateResult> {
    return this.usersService.delete(request);
  }
}
