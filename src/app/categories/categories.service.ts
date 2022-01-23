/** @format */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { IdDto } from '../core';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  /* UTILITY */

  async getRelated(idDto: IdDto, user: User): Promise<Category> {
    const getOneDto: GetOneDto = {
      scope: ['user']
    };

    const category: Category = await this.categoriesRepository.getOne(idDto, getOneDto);

    if (!category) {
      throw new NotFoundException();
    }

    if (category.user.id !== user.id) {
      throw new ForbiddenException();
    }

    return category;
  }

  async getAvailable(createDto: CreateDto | UpdateDto, user: User, idDto?: IdDto): Promise<void> {
    const getAllDto: GetAllDto = {
      name: createDto.name,
      userId: user.id,
      exact: 1
    };

    const category: Category[] = await this.categoriesRepository.getAll(getAllDto);

    if (!!category.length) {
      const categoryExist: Category = category.shift();

      if (categoryExist && (!idDto || idDto.id !== categoryExist.id)) {
        throw new BadRequestException(categoryExist.name + ' already exists');
      }
    }
  }

  /* CRUD */

  async create(request: Request, createDto: CreateDto): Promise<Category> {
    const user: User = request.user as User;

    await this.getAvailable(createDto, user);

    return await this.categoriesRepository.create(createDto, user);
  }

  async getAll(request: Request, getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesRepository.getAll(getAllDto);
  }

  async getOne(request: Request, idDto: IdDto, getOneDto?: GetOneDto): Promise<Category> {
    const category: Category = await this.categoriesRepository.getOne(idDto, getOneDto);

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async update(request: Request, idDto: IdDto, updateDto: UpdateDto): Promise<Category> {
    const user: User = request.user as User;

    await this.getRelated(idDto, user);
    await this.getAvailable(updateDto, user, idDto);

    return await this.categoriesRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<Category> {
    const user: User = request.user as User;
    const category: Category = await this.getRelated(idDto, user);

    await this.categoriesRepository.delete(idDto);

    return category;
  }
}
