/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { GetAllDto, GetOneDto } from './posts.dto';
import { IdentifierDto } from '../core';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>
  ) {}

  async getAll(getAllDto?: GetAllDto): Promise<Post[]> {
    let query = getRepository(Post)
      .createQueryBuilder('post')
      .orderBy('post.id', 'DESC')
      .select(['post.id', 'post.title', 'post.image', 'post.createdAt', 'post.updatedAt']);

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
          .leftJoin('post.user', 'user');
      }

      if (getAllDto.scope.includes('category')) {
        query = query
          .addSelect([
            'category.id',
            'category.name',
            'category.isPrivate',
            'category.createdAt',
            'category.updatedAt'
          ])
          .leftJoin('post.category', 'category');
      }
    }

    if ('title' in getAllDto) {
      query = query.where('post.title like :title', { title: '%' + getAllDto.title + '%' });
    }

    if ('userId' in getAllDto) {
      query = query[getAllDto.title ? 'andWhere' : 'where']('post.userId like :userId', {
        userId: getAllDto.userId
      });
    }

    if ('categoryId' in getAllDto) {
      query = query[getAllDto.title || getAllDto.userId ? 'andWhere' : 'where'](
        'post.categoryId like :categoryId',
        {
          categoryId: getAllDto.categoryId
        }
      );
    }

    if (!('page' in getAllDto) || !('size' in getAllDto)) {
      getAllDto = {
        ...getAllDto,
        page: 1,
        size: 10
      };
    }

    query = query.skip((getAllDto.page - 1) * getAllDto.size).take(getAllDto.size);

    return await query.getMany();
  }

  async getOneById(identifierDto: IdentifierDto, getOneDto?: GetOneDto): Promise<Post> {
    let query = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id: identifierDto.id })
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.image',
        'post.createdAt',
        'post.updatedAt'
      ]);

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
          .leftJoin('post.user', 'user');
      }

      if (getOneDto.scope.includes('category')) {
        query = query
          .addSelect([
            'category.id',
            'category.name',
            'category.isPrivate',
            'category.createdAt',
            'category.updatedAt'
          ])
          .leftJoin('post.category', 'category');
      }
    }

    return await query.getOne();
  }
}
