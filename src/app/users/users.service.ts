/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { Request, Response } from 'express';
import { IdentifierDto } from '../core';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {}

  async create(createDto: CreateDto, response: Response): Promise<User> {
    const userExist: User = await this.usersRepository.getByEmail(createDto);

    if (userExist) {
      throw new BadRequestException(userExist.email + ' already exists');
    }

    const userCreated: User = await this.usersRepository.create(createDto);

    return await this.authService.getSharedResponse(userCreated, response);
  }

  async getMe(request: Request, getOneDto?: GetOneDto): Promise<User> {
    const user: User = request.user as User;
    const userExist: User = await this.usersRepository.getOne(user, getOneDto);

    if (!userExist) {
      throw new NotFoundException();
    }

    return userExist;
  }

  async getAll(getAllDto: GetAllDto): Promise<User[]> {
    return await this.usersRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto: GetOneDto): Promise<User> {
    const user: User = await this.usersRepository.getOne(identifierDto, getOneDto);

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(updateDto: UpdateDto, request: Request): Promise<User> {
    const user: User = await this.getMe(request);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.usersRepository.update(updateDto, user);
  }

  async delete(request: Request): Promise<User> {
    const user: User = await this.getMe(request);

    if (!user) {
      throw new NotFoundException();
    }

    return await this.usersRepository.delete(user);
  }
}
