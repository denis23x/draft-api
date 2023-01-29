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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { UserGetAllDto, UserGetOneDto, UserUpdateDto, UserDto, UserCreateDto } from './dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRelationGuard } from '../auth/guards';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    description: '## Create user'
  })
  @ApiResponse({
    status: 201,
    type: UserDto
  })
  @Post()
  async create(@Req() request: Request, @Body() userCreateDto: UserCreateDto): Promise<User> {
    return this.userService.create(request, userCreateDto);
  }

  @ApiOperation({
    description: '## Get all users'
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
    isArray: true
  })
  @Get()
  async getAll(@Req() request: Request, @Query() userGetAllDto: UserGetAllDto): Promise<User[]> {
    return this.userService.getAll(request, userGetAllDto);
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
  async getOne(@Req() request: Request, @Param('id') id: number, @Query() userGetOneDto: UserGetOneDto): Promise<User> {
    return this.userService.getOne(request, id, userGetOneDto);
  }

  // prettier-ignore
  @ApiOperation({
    description: '## Update user'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @ApiBearerAuth('access')
  @Put(':id')
  @UseGuards(AuthGuard('access'), UserRelationGuard)
  async update(@Req() request: Request, @Param('id') id: number, @Body() userUpdateDto: UserUpdateDto): Promise<User> {
    return this.userService.update(request, id, userUpdateDto);
  }

  @ApiOperation({
    description: '## Delete user'
  })
  @ApiResponse({
    status: 200,
    type: UserDto
  })
  @ApiBearerAuth('access')
  @Delete(':id')
  @UseGuards(AuthGuard('access'), UserRelationGuard)
  async delete(@Req() request: Request, @Param('id') id: number): Promise<User> {
    return this.userService.delete(request, id);
  }
}
