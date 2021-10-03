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
      .createQueryBuilder('Post')
      .orderBy('Post.id', 'DESC')
      .select([
        'Post.id',
        'Post.title',
        'Post.image',
        'Post.createdAt',
        'Post.updatedAt',
        'User.id',
        'User.name',
        'User.avatar',
        'User.createdAt',
        'User.updatedAt',
        'Category.id',
        'Category.title',
        'Category.createdAt',
        'Category.updatedAt'
      ])
      .leftJoin('Post.user', 'User')
      .leftJoin('Post.category', 'Category');

    if (title) {
      query = query.where('Post.title like :title', { title: '%' + title + '%' });
    }

    if (userId) {
      query = query[title ? 'andWhere' : 'where']('Post.userId like :userId', { userId });
    }

    if (categoryId) {
      query = query[title || userId ? 'andWhere' : 'where']('Post.categoryId like :categoryId', {
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
      .createQueryBuilder('Post')
      .where('Post.id = :id', { id })
      .select([
        'Post.id',
        'Post.title',
        'Post.body',
        'Post.image',
        'Post.createdAt',
        'Post.updatedAt',
        'User.id',
        'User.name',
        'User.avatar',
        'User.createdAt',
        'User.updatedAt',
        'Category.id',
        'Category.title',
        'Category.createdAt',
        'Category.updatedAt'
      ])
      .leftJoin('Post.user', 'User')
      .leftJoin('Post.category', 'Category');

    return await query.getOne();
  }
}
