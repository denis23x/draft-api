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
  UseFilters,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { Request, Response } from 'express';
import { TypeORMExceptionFilter, IdDto, TransformInterceptor } from '../core';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  @UseFilters(TypeORMExceptionFilter)
  async create(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() createDto: CreateDto
  ): Promise<User> {
    return await this.usersService.create(request, response, createDto);
  }

  @Get()
  @UseInterceptors(TransformInterceptor)
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<User[]> {
    return await this.usersService.getAll(request, getAllDto);
  }

  @Get(':id')
  @UseInterceptors(TransformInterceptor)
  async getOne(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Query() getOneDto: GetOneDto
  ): Promise<User> {
    return await this.usersService.getOne(request, idDto, getOneDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor, TransformInterceptor)
  @UseFilters(TypeORMExceptionFilter)
  async update(
    @Req() request: Request,
    @Param() idDto: IdDto,
    @Body() updateDto: UpdateDto
  ): Promise<User> {
    return await this.usersService.update(request, idDto, updateDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(TransformInterceptor)
  async delete(@Req() request: Request, @Param() idDto: IdDto): Promise<User> {
    return await this.usersService.delete(request, idDto);
  }
}
