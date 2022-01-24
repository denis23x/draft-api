/** @format */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { IdDto } from '../core';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(request: Request, createDto: CreateDto): Promise<Category> {
    const user: User = request.user as User;

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
    const category: Category = user.categories.find((category: Category) => {
      return category.id === idDto.id;
    });

    if (!category) {
      throw new ForbiddenException();
    }

    return await this.categoriesRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<Category> {
    const user: User = request.user as User;
    const category: Category = user.categories.find((category: Category) => {
      return category.id === idDto.id;
    });

    if (!category) {
      throw new ForbiddenException();
    }

    await this.categoriesRepository.delete(idDto);

    delete user.categories;

    const categoryDeleted: Category = {
      ...category,
      user
    };

    return categoryDeleted;
  }
}
