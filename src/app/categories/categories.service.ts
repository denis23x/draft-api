/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, FindAllDto, FindOneDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createDto: CreateDto, request: Request): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.findOneByIdRelatedToUser(createDto, user);

    if (isExist) {
      throw new BadRequestException(isExist.name + ' already exists');
    }

    return await this.categoriesRepository.create(createDto, user);
  }

  async findAll(findAllDto: FindAllDto): Promise<Category[]> {
    return this.categoriesRepository.findAll(findAllDto);
  }

  async findOne(findOneDto: FindOneDto): Promise<Category> {
    const isExist = this.categoriesRepository.findOneById(findOneDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }
}
