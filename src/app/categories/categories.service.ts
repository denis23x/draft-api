/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateCategoryDto, FindAllCategoriesDto, FindOneCategoryDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto, request: Request): Promise<Category> {
    const user = request['user'] as User;
    const isExist = await this.categoriesRepository.findOneRelatedToUser(createCategoryDto, user);

    if (isExist) {
      throw new BadRequestException(isExist.name + ' already exists');
    }

    return await this.categoriesRepository.create(createCategoryDto, user);
  }

  async findAll(findAllCategoriesDto: FindAllCategoriesDto): Promise<Category[]> {
    return this.categoriesRepository.findAll(findAllCategoriesDto);
  }

  async findOne(findOneCategoryDto: FindOneCategoryDto): Promise<Category> {
    const isExist = this.categoriesRepository.findOneById(findOneCategoryDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }
}
