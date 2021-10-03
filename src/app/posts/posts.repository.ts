/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>
  ) {}

  async findAll(
    page: number,
    size: number,
    title?: string,
    userId?: number,
    categoryId?: number
  ): Promise<Post[]> {
    let query = getRepository(Post)
      .createQueryBuilder('post')
      .orderBy('post.id', 'DESC')
      .select([
        'post.id',
        'post.title',
        'post.image',
        'post.createdAt',
        'post.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt',
        'category.id',
        'category.title',
        'category.createdAt',
        'category.updatedAt'
      ])
      .leftJoin('post.user', 'user')
      .leftJoin('post.category', 'category');

    if (title) {
      query = query.where('post.title like :title', { title: '%' + title + '%' });
    }

    if (userId) {
      query = query[title ? 'andWhere' : 'where']('post.userId like :userId', { userId });
    }

    if (categoryId) {
      query = query[title || userId ? 'andWhere' : 'where']('post.categoryId like :categoryId', {
        categoryId
      });
    }

    if (page && size) {
      query = query.skip((page - 1) * size).take(size);
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<Post> {
    const query = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.image',
        'post.createdAt',
        'post.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt',
        'category.id',
        'category.title',
        'category.createdAt',
        'category.updatedAt'
      ])
      .leftJoin('post.user', 'user')
      .leftJoin('post.category', 'category');

    return await query.getOne();
  }
}
