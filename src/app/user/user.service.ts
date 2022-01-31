/** @format */

import { Injectable } from '@nestjs/common';
import { CreateUserDto, GetAllUserDto, GetOneUserDto, UpdateUserDto } from './user.dto';
import { Request, Response } from 'express';
import { PrismaService } from '../core';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { TokenService } from '../token/token.service';

@Injectable()
export class UserService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly prismaService: PrismaService
  ) {}

  async create(request: Request, response: Response, createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.hasOwnProperty('password')) {
      createUserDto.password = await hash(createUserDto.password, 10);
    }

    // @ts-ignore
    const user: User = await this.prismaService.user.create({
      ...this.prismaService.setNonSensitiveUserSelect(),
      data: createUserDto
    });

    return this.setResponse(user, response);
  }

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

  async setResponse(user: User, response: Response): Promise<User> {
    const { select } = this.prismaService.setNonSensitiveUserSelect();

    for (const column in select) {
      !select[column] && delete user[column];
    }

    const refreshToken: string = await this.tokenService.generateRefreshToken(user.id);
    const accessToken: string = await this.tokenService.generateAccessToken(user.id);

    // TODO: enable secure and sameSite (need HTTPS)
    // secure: true,
    // sameSite: 'none'

    response.cookie('refreshToken', refreshToken, {
      domain: process.env.APP_COOKIE_DOMAIN,
      path: '/api/auth/refresh',
      signed: true,
      httpOnly: true,
      maxAge: Number(process.env.JWT_REFRESH_TTL)
    });

    return {
      ...user,
      // @ts-ignore
      accessToken
    };
  }
}
