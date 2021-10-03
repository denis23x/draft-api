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
      .createQueryBuilder('Category')
      .orderBy('Category.id', 'DESC')
      .select([
        'Category.id',
        'Category.title',
        'Category.createdAt',
        'Category.updatedAt',
        'User.id',
        'User.name',
        'User.avatar',
        'User.createdAt',
        'User.updatedAt'
      ])
      .leftJoin('Category.user', 'User');

    if (title) {
      query = query.where('Category.title like :title', { title: '%' + title + '%' });
    }

    if (userId) {
      query = query[title ? 'andWhere' : 'where']('Category.userId like :userId', { userId });
    }

    if (page && size) {
      query = query.skip((page - 1) * size).take(size);
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('Category')
      .where('Category.id = :id', { id })
      .select([
        'Category.id',
        'Category.title',
        'Category.createdAt',
        'Category.updatedAt',
        'User.id',
        'User.name',
        'User.avatar',
        'User.createdAt',
        'User.updatedAt',
        'Post.id',
        'Post.title',
        'Post.image',
        'Post.createdAt',
        'Post.updatedAt'
      ])
      .leftJoin('Category.user', 'User')
      .leftJoin('Category.posts', 'Post');

    return await query.getOne();
  }
}
