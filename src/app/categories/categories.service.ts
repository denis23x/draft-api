/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, FindAllDto, UpdateDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { IdentifierDto } from '../core';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createDto: CreateDto, request: Request): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.findOneByNameRelatedToUser(createDto, user);

    if (isExist) {
      throw new BadRequestException(isExist.name + ' already exists');
    }

    return await this.categoriesRepository.create(createDto, user);
  }

  async findAll(findAllDto: FindAllDto): Promise<Category[]> {
    return this.categoriesRepository.findAll(findAllDto);
  }

  async findOne(identifierDto: IdentifierDto): Promise<Category> {
    const isExist = this.categoriesRepository.findOneById(identifierDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async updateOne(
    identifierDto: IdentifierDto,
    updateDto: UpdateDto,
    request: Request
  ): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.findOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.updateOne(updateDto, isExist);
  }

  async deleteOne(identifierDto: IdentifierDto, request: Request): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.findOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.deleteOne(identifierDto, isExist);
  }
}
