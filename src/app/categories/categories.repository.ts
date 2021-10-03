/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async findAll(page: number, size: number, title?: string, userId?: number): Promise<Category[]> {
    let query = getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.id', 'DESC')
      .select([
        'category.id',
        'category.title',
        'category.createdAt',
        'category.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt'
      ])
      .leftJoin('category.user', 'user');

    if (title) {
      query = query.where('category.title like :title', { title: '%' + title + '%' });
    }

    if (userId) {
      query = query[title ? 'andWhere' : 'where']('category.userId like :userId', { userId });
    }

    if (page && size) {
      query = query.skip((page - 1) * size).take(size);
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id })
      .select([
        'category.id',
        'category.title',
        'category.createdAt',
        'category.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt',
        'post.id',
        'post.title',
        'post.image',
        'post.createdAt',
        'post.updatedAt'
      ])
      .leftJoin('category.user', 'user')
      .leftJoin('category.posts', 'post');

    return await query.getOne();
  }
}
