/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { IdentifierDto } from '../core';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createDto: CreateDto, request: Request): Promise<Category> {
    const user: User = request.user as User;
    const category: Category = await this.categoriesRepository.getRelatedByName(createDto, user);

    if (category) {
      throw new BadRequestException(category.name + ' already exists');
    }

    return await this.categoriesRepository.create(createDto, user);
  }

  async getAll(getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto?: GetOneDto): Promise<Category> {
    const category: Category = await this.categoriesRepository.getOne(identifierDto, getOneDto);

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  async update(
    identifierDto: IdentifierDto,
    updateDto: UpdateDto,
    request: Request
  ): Promise<Category> {
    const user: User = request.user as User;
    const category: Category = await this.categoriesRepository.getRelatedById(identifierDto, user);

    if (!category) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.update(updateDto, category);
  }

  async delete(identifierDto: IdentifierDto, request: Request): Promise<Category> {
    const user: User = request.user as User;
    const category: Category = await this.categoriesRepository.getRelatedById(identifierDto, user);

    if (!category) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.delete(category);
  }
}
