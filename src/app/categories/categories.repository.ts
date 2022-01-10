/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './categories.dto';
import { User } from '../users/users.entity';
import { HelperService, IdentifierDto } from '../core';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
    private readonly helperService: HelperService
  ) {}

  /* UTILITY */

  async getRelatedByName(createDto: CreateDto, user: User): Promise<Category> {
    const query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.name = :name', { name: createDto.name })
      .andWhere('category.userId = :userId', { userId: user.id })
      .select([
        'category.id',
        'category.name',
        'category.createdAt',
        'category.updatedAt',
        'category.userId'
      ]);

    return await query.getOne();
  }

  async getRelatedById(identifierDto: IdentifierDto, user: User): Promise<Category> {
    const query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: identifierDto.id })
      .andWhere('category.userId = :userId', { userId: user.id })
      .select([
        'category.id',
        'category.name',
        'category.createdAt',
        'category.updatedAt',
        'category.userId'
      ]);

    return await query.getOne();
  }

  /* CRUD */

  async create(createDto: CreateDto, user: User): Promise<Category> {
    const category: Category = new Category();

    category.name = createDto.name;
    category.user = user;

    return await this.repository.save(category);
  }

  async getAll(getAllDto: GetAllDto): Promise<Category[]> {
    let query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.id', 'DESC')
      .select(['category.id', 'category.name', 'category.createdAt', 'category.updatedAt']);

    if ('scope' in getAllDto) {
      if (getAllDto.scope.includes('user')) {
        query = query
          .addSelect([
            'user.id',
            'user.name',
            'user.avatar',
            'user.biography',
            'user.createdAt',
            'user.updatedAt'
          ])
          .leftJoin('category.user', 'user');
      }

      if (getAllDto.scope.includes('posts')) {
        query = query
          .addOrderBy('posts.id', 'DESC')
          .addSelect([
            'posts.id',
            'posts.title',
            'posts.image',
            'posts.createdAt',
            'posts.updatedAt'
          ])
          .leftJoin('category.posts', 'posts');
      }
    }

    if ('name' in getAllDto) {
      query = query.where('category.name like :name', {
        name: '%' + getAllDto.name + '%'
      });
    }

    if ('userId' in getAllDto) {
      query = query[getAllDto.name ? 'andWhere' : 'where']('category.userId like :userId', {
        userId: getAllDto.userId
      });
    }

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto?: GetOneDto): Promise<Category> {
    let query: SelectQueryBuilder<Category> = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: identifierDto.id })
      .select(['category.id', 'category.name', 'category.createdAt', 'category.updatedAt']);

    if (getOneDto) {
      if ('scope' in getOneDto) {
        if (getOneDto.scope.includes('user')) {
          query = query
            .addSelect([
              'user.id',
              'user.name',
              'user.avatar',
              'user.biography',
              'user.createdAt',
              'user.updatedAt'
            ])
            .leftJoin('category.user', 'user');
        }

        if (getOneDto.scope.includes('posts')) {
          query = query
            .addOrderBy('posts.id', 'DESC')
            .addSelect([
              'posts.id',
              'posts.title',
              'posts.image',
              'posts.createdAt',
              'posts.updatedAt'
            ])
            .leftJoin('category.posts', 'posts');
        }
      }
    }

    return await query.getOne();
  }

  async update(updateDto: UpdateDto, category: Category): Promise<Category> {
    const categoryCreated: Category = new Category();

    categoryCreated.name = updateDto.name;

    await this.repository.update(category.id, categoryCreated);

    return await this.getOne(category);
  }

  async delete(category: Category): Promise<Category> {
    await this.repository.delete(category.id);

    return category;
  }
}
