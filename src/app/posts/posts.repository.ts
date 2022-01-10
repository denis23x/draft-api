/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { HelperService, IdentifierDto } from '../core';
import { User } from '../users/users.entity';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly categoriesService: CategoriesService,
    private readonly helperService: HelperService
  ) {}

  /* UTILITY */

  async getRelatedByName(createDto: CreateDto, user: User): Promise<Post> {
    const query: SelectQueryBuilder<Post> = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.title = :title', { title: createDto.title })
      .andWhere('post.userId = :userId', { userId: user.id })
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.createdAt',
        'post.updatedAt',
        'post.userId'
      ]);

    return await query.getOne();
  }

  async getRelatedById(identifierDto: IdentifierDto, user: User): Promise<Post> {
    const query: SelectQueryBuilder<Post> = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id: identifierDto.id })
      .andWhere('post.userId = :userId', { userId: user.id })
      .select([
        'post.id',
        'post.title',
        'post.body',
        'post.createdAt',
        'post.updatedAt',
        'post.userId'
      ]);

    return await query.getOne();
  }

  /* CRUD */

  async create(createDto: CreateDto, user: User): Promise<Post> {
    const post: Post = new Post();

    post.title = createDto.title;
    post.body = createDto.body;
    post.user = user;

    if ('image' in createDto) {
      post.image = createDto.image;
    }

    const identifierDto: IdentifierDto = {
      id: Number(createDto.categoryId)
    };

    post.category = await this.categoriesService.getOne(identifierDto);

    return await this.repository.save(post);
  }

  async getAll(getAllDto: GetAllDto): Promise<Post[]> {
    let query: SelectQueryBuilder<Post> = getRepository(Post)
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
          .addSelect(['category.id', 'category.name', 'category.createdAt', 'category.updatedAt'])
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

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto?: GetOneDto): Promise<Post> {
    let query: SelectQueryBuilder<Post> = getRepository(Post)
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
            .leftJoin('post.user', 'user');
        }

        if (getOneDto.scope.includes('category')) {
          query = query
            .addSelect(['category.id', 'category.name', 'category.createdAt', 'category.updatedAt'])
            .leftJoin('post.category', 'category');
        }
      }
    }

    return await query.getOne();
  }

  async update(updateDto: UpdateDto, post: Post): Promise<Post> {
    const postCreated: Post = new Post();

    postCreated.title = updateDto.title;
    postCreated.body = updateDto.body;

    if ('image' in updateDto) {
      postCreated.image = updateDto.image;
    }

    if ('categoryId' in updateDto) {
      const identifierDto: IdentifierDto = {
        id: Number(updateDto.categoryId)
      };

      postCreated.category = await this.categoriesService.getOne(identifierDto);
    }

    await this.repository.update(post.id, postCreated);

    const getOneDto: GetOneDto = {
      scope: ['category', 'user']
    };

    return await this.getOne(post, getOneDto);
  }

  async delete(post: Post): Promise<Post> {
    await this.repository.delete(post.id);

    return post;
  }
}
