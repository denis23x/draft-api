/** @format */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
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

  /* UTILITY */

  async getRelated(idDto: IdDto, user: User): Promise<User> {
    const userExist: User = await this.usersRepository.getOne(idDto);

    if (!userExist) {
      throw new NotFoundException();
    }

    if (userExist.id !== user.id) {
      throw new ForbiddenException();
    }

    return user;
  }

  async getAvailable(createDto: CreateDto | UpdateDto): Promise<void> {
    const getAllDto: GetAllDto = {
      name: createDto.name,
      email: createDto.email,
      exact: 1
    };

    const user: User[] = await this.usersRepository.getAll(getAllDto);
    const userExist: User = user.shift();

    if (userExist) {
      const errorMessage: string =
        createDto.name === userExist.name ? createDto.name : createDto.email;

      throw new BadRequestException(errorMessage + ' already exists');
    }
  }

  /* CRUD */

  async create(request: Request, response: Response, createDto: CreateDto): Promise<User> {
    await this.getAvailable(createDto);

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

    await this.getRelated(idDto, user);
    await this.getAvailable(updateDto);

    return await this.usersRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<User> {
    const user: User = request.user as User;
    const userExist: User = await this.getRelated(idDto, user);

    await this.usersRepository.delete(idDto);

    return userExist;
  }
}
