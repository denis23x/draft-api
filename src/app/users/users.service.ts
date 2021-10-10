/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { FindAllDto, CreateDto, FindOneByIdDto, DeleteDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { UpdateResult } from 'typeorm';
import { Request, Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {}

  async create(createDto: CreateDto, response: Response): Promise<User> {
    const isExist = await this.usersRepository.findOneByEmail(createDto);

    if (isExist) {
      throw new BadRequestException(isExist.email + ' already exists');
    }

    const user = await this.usersRepository.create(createDto);

    return this.authService.getSharedResponse(user, response);
  }

  async findAll(findAllDto: FindAllDto): Promise<User[]> {
    return this.usersRepository.findAll(findAllDto);
  }

  async findOneById(findOneByIdDto: FindOneByIdDto): Promise<User> {
    const isExist = await this.usersRepository.findOneById(findOneByIdDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async findMe(request: Request): Promise<User> {
    const user = request.user as User;
    const isExist = await this.usersRepository.findOneById(user as FindOneByIdDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async delete(request: Request): Promise<UpdateResult> {
    const user = request.user as User;
    const isExist = await this.usersRepository.findOneById(user as FindOneByIdDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    const deleteDto: DeleteDto = {
      id: isExist.id
    };

    return this.usersRepository.delete(deleteDto);
  }
}
