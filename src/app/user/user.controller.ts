/** @format */

import { Body, Controller, Delete, Get, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { GetAllDto, GetOneDto, UpdateDto, UserDto } from './dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: '## Get all users'
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true
  })
  @Get()
  async getAll(@Req() request: Request, @Query() getAllDto: GetAllDto): Promise<User[]> {
    return this.userService.getAll(request, getAllDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Get user'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @Get(':id')
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() getOneDto: GetOneDto): Promise<User> {
    return this.userService.getOne(request, id, getOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update user'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @ApiBearerAuth('accessToken')
  @Put(':id')
  @UseGuards(AuthGuard('custom'))
  async update(@Req() request: Request, @Param('id') id: number, @Body() updateDto: UpdateDto): Promise<User> {
    return this.userService.update(request, id, updateDto);
  }

  @ApiOperation({
    description: '## Delete user'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @ApiBearerAuth('accessToken')
  @Delete(':id')
  @UseGuards(AuthGuard('custom'))
  async delete(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.userService.delete(request, id);
  }
}
