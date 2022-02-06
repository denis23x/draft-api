/** @format */

import { Injectable } from '@nestjs/common';
import { GetAllUserDto, GetOneUserDto, UpdateUserDto } from './user.dto';
import { Request } from 'express';
import { PrismaService } from '../core';
import { User } from '@prisma/client';
import { TokenService } from '../token/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}

  async getAll(request: Request, getAllUserDto: GetAllUserDto): Promise<User[]> {
    let userFindManyArgs: any = {
      ...this.prismaService.setNonSensitiveUserSelect(),
      ...this.prismaService.setOrder(),
      ...this.prismaService.setPagination()
    };

    if (!!getAllUserDto) {
      /** Search */

      if (getAllUserDto.hasOwnProperty('name')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, getAllUserDto, 'name');
      }

      if (getAllUserDto.hasOwnProperty('email')) {
        userFindManyArgs = this.prismaService.setWhere(userFindManyArgs, getAllUserDto, 'email');
      }

      /** Scope */

      if (getAllUserDto.hasOwnProperty('scope')) {
        if (getAllUserDto.scope.includes('categories')) {
          userFindManyArgs.select = {
            ...userFindManyArgs.select,
            categories: {
              ...this.prismaService.setCategorySelect(),
              ...this.prismaService.setOrder()
            }
          };
        }

        if (getAllUserDto.scope.includes('posts')) {
        }
      }

      /** Pagination */

      if (getAllUserDto.hasOwnProperty('page') && getAllUserDto.hasOwnProperty('size')) {
        userFindManyArgs = this.prismaService.setPagination(userFindManyArgs, getAllUserDto);
      }
    }

    // @ts-ignore
    return this.prismaService.user.findMany(userFindManyArgs);
  }

  async getOne(request: Request, id: number, getOneUserDto: GetOneUserDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.findUnique({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      }
    });
  }

  async update(request: Request, id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.update({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      },
      data: updateUserDto
    });
  }

  async delete(request: Request, id: number): Promise<User> {
    // @ts-ignore
    return this.prismaService.user.delete({
      ...this.prismaService.setNonSensitiveUserSelect(),
      where: {
        id
      }
    });
  }
}
