/** @format */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { User } from './users.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { IdDto } from '../core';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {}

  async create(request: Request, response: Response, createDto: CreateDto): Promise<User> {
    const user: User = await this.usersRepository.create(createDto);

    return await this.authService.setResponse(user, response);
  }

  async getAll(request: Request, getAllDto: GetAllDto): Promise<User[]> {
    return await this.usersRepository.getAll(getAllDto);
  }

  async getOne(request: Request, idDto: IdDto, getOneDto: GetOneDto): Promise<User> {
    const user: User = await this.usersRepository.getOne(idDto, getOneDto);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(request: Request, idDto: IdDto, updateDto: UpdateDto): Promise<User> {
    const user: User = request.user as User;

    if (idDto.id !== user.id) {
      throw new ForbiddenException();
    }

    return await this.usersRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<User> {
    const user: User = request.user as User;

    if (idDto.id !== user.id) {
      throw new ForbiddenException();
    }

    await this.usersRepository.delete(idDto);

    return user;
  }
}
