/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { FindAllCategoriesDto, FindOneCategoryDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(findAllCategoriesDto: FindAllCategoriesDto): Promise<Category[]> {
    return this.categoriesRepository.findAll(
      findAllCategoriesDto.page,
      findAllCategoriesDto.size,
      findAllCategoriesDto.name,
      findAllCategoriesDto.userId
    );
  }

  async findOne(findOneCategoryDto: FindOneCategoryDto): Promise<Category> {
    const isExist = this.categoriesRepository.findOneById(Number(findOneCategoryDto.id));

    if (isExist) {
      return isExist;
    }

    throw new NotFoundException();
  }
}
