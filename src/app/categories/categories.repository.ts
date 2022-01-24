/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { User } from '../users/users.entity';
import { HelperService, IdDto } from '../core';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly helperService: HelperService
  ) {}

  async create(createDto: CreateDto, user: User): Promise<Category> {
    const category: Category = new Category();

    category.name = createDto.name;

    delete user.categories;

    category.user = user;

    return await this.repository.save(category);
  }

  async getAll(getAllDto?: GetAllDto): Promise<Category[]> {
    let query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.id', 'DESC');

    if (!!getAllDto) {
      const exact: boolean = 'exact' in getAllDto && !!getAllDto.exact;
      const op: string = exact ? '=' : 'like';
      const parameter = (column: string): string => (exact ? column : '%' + column + '%');

      if ('scope' in getAllDto) {
        if (getAllDto.scope.includes('user')) {
          query = query.leftJoinAndSelect('category.user', 'user');
        }

        if (getAllDto.scope.includes('posts')) {
          query = query.addOrderBy('posts.id', 'DESC').leftJoinAndSelect('category.posts', 'posts');
        }
      }

      if ('name' in getAllDto) {
        query = query.where('category.name ' + op + ' :name', {
          name: parameter(getAllDto.name)
        });
      }

      if ('userId' in getAllDto) {
        query = query[getAllDto.name ? 'andWhere' : 'where']('category.userId = :userId', {
          userId: getAllDto.userId
        });
      }
    }

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(idDto: IdDto, getOneDto?: GetOneDto): Promise<Category> {
    let query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: idDto.id })
      .select(['category.id', 'category.name', 'category.createdAt', 'category.updatedAt']);

    if (!!getOneDto) {
      if ('scope' in getOneDto) {
        if (getOneDto.scope.includes('user')) {
          query = query.leftJoinAndSelect('category.user', 'user');
        }

        if (getOneDto.scope.includes('posts')) {
          query = query.addOrderBy('posts.id', 'DESC').leftJoinAndSelect('category.posts', 'posts');
        }
      }
    }

    return await query.getOne();
  }

  async update(idDto: IdDto, updateDto: UpdateDto): Promise<Category> {
    const categoryCreated: Category = new Category();

    if ('name' in updateDto) {
      categoryCreated.name = updateDto.name;
    }

    await this.repository.update(idDto.id, categoryCreated);

    return await this.getOne(idDto);
  }

  async delete(idDto: IdDto): Promise<void> {
    await this.repository.delete(idDto.id);
  }
}
