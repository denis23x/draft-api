/** @format */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { User } from './users.entity';
import { FindAllUsersDto, CreateUserDto, DeleteUserDto, FindOneUserDto } from './users.dto';
import { UsersRepository } from './users.repository';
import { AuthService } from '../auth/auth.service';
import { UpdateResult } from 'typeorm';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository
  ) {}

  async findAll(findAllUsersDto: FindAllUsersDto): Promise<User[]> {
    return this.usersRepository.findAll(
      findAllUsersDto.page,
      findAllUsersDto.size,
      findAllUsersDto.name
    );
  }

  async create(createUserDto: CreateUserDto, response: Response): Promise<User> {
    const isExist = await this.usersRepository.findOneByEmail(createUserDto.email);

    if (isExist) {
      throw new BadRequestException('entry with email ' + isExist.email + ' already exists');
    }

    const user = await this.usersRepository.create(createUserDto);

    return this.authService.getSharedResponse(user, response);
  }

  async findOne(findOneUserDto: FindOneUserDto): Promise<User> {
    const isExist = await this.usersRepository.findOneById(Number(findOneUserDto.id));

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  // TODO: fix Request
  async findMe(request: any): Promise<User> {
    const user = request['user'] as User;
    const isExist = await this.usersRepository.findOneById(Number(user.id));

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  // TODO: fix Request
  async delete(deleteUserDto: DeleteUserDto, request: any): Promise<UpdateResult> {
    const user = request['user'] as User;
    const isExist = await this.usersRepository.findOneById(Number(deleteUserDto.id));

    if (!isExist) {
      throw new NotFoundException();
    }

    if (user.id !== isExist.id) {
      throw new UnauthorizedException();
    }

    return this.usersRepository.delete(isExist.id);
  }
}
