/** @format */

import { Body, Controller, Delete, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetAllUserDto, GetOneUserDto, UpdateUserDto } from './user.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(@Req() request: Request, @Query() getAllUserDto: GetAllUserDto): Promise<User[]> {
    return this.userService.getAll(request, getAllUserDto);
  }

  // prettier-ignore
  @Get(':id')
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() getOneUserDto: GetOneUserDto
  ): Promise<User> {
    return this.userService.getOne(request, id, getOneUserDto);
  }

  // prettier-ignore
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(@Req() request: Request, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.userService.update(request, id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.userService.delete(request, id);
  }
}
