/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, UpdateDto } from './categories.dto';
import { CategoriesRepository } from './categories.repository';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { IdentifierDto } from '../core';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async createOne(createDto: CreateDto, request: Request): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.getOneByNameRelatedToUser(createDto, user);

    if (isExist) {
      throw new BadRequestException(isExist.name + ' already exists');
    }

    return await this.categoriesRepository.createOne(createDto, user);
  }

  async getAll(getAllDto: GetAllDto): Promise<Category[]> {
    return await this.categoriesRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto): Promise<Category> {
    const isExist = await this.categoriesRepository.getOneById(identifierDto);

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
    const isExist = await this.categoriesRepository.getOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.updateOne(updateDto, isExist);
  }

  async deleteOne(identifierDto: IdentifierDto, request: Request): Promise<Category> {
    const user = request.user as User;
    const isExist = await this.categoriesRepository.getOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.categoriesRepository.deleteOne(identifierDto, isExist);
  }
}
