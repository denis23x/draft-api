/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { CreateDto, GetAllDto, UpdateDto } from './users.dto';
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

  async createOne(createDto: CreateDto, response: Response): Promise<User> {
    const isExist = await this.usersRepository.getOneByEmail(createDto);

    if (isExist) {
      throw new BadRequestException(isExist.email + ' already exists');
    }

    const user = await this.usersRepository.createOne(createDto);

    return await this.authService.getSharedResponse(user, response);
  }

  async getProfile(request: Request): Promise<User> {
    const user = request.user as User;
    const isExist = await this.usersRepository.getOneById(user as IdentifierDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async getAll(getAllDto: GetAllDto): Promise<User[]> {
    return await this.usersRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto): Promise<User> {
    const isExist = await this.usersRepository.getOneById(identifierDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async updateProfile(updateDto: UpdateDto, request: Request): Promise<User> {
    const isExist = await this.getProfile(request);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.usersRepository.updateProfile(updateDto, isExist);
  }

  async deleteProfile(request: Request): Promise<User> {
    const isExist = await this.getProfile(request);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.usersRepository.deleteProfile(isExist);
  }
}
