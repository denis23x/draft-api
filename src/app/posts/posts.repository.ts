/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { IdentifierDto } from '../core';
import { User } from '../users/users.entity';
import { Category } from '../categories/categories.entity';
import { GetOneDto as GetOneDtoCategory } from '../categories/categories.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly categoriesService: CategoriesService
  ) {}

  async createOne(createDto: CreateDto, user: User): Promise<Post> {
    const entity = new Post();

    entity.title = createDto.title;
    entity.body = createDto.body;
    entity.user = user;

    if ('image' in createDto) {
      entity.image = createDto.image;
    }

    const identifierDto: IdentifierDto = {
      id: Number(createDto.categoryId)
    };

    entity.category = await this.categoriesService.getOne(identifierDto, {} as GetOneDtoCategory);

    return await this.repository.save(entity);
  }

  async getAll(getAllDto: GetAllDto): Promise<Post[]> {
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

  async getOneById(identifierDto: IdentifierDto, getOneDto: GetOneDto): Promise<Post> {
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

  async getOneByNameRelatedToUser(createDto: CreateDto, user: User): Promise<Post> {
    const query = getRepository(Post)
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

  async getOneByIdRelatedToUser(identifierDto: IdentifierDto, user: User): Promise<Post> {
    const query = getRepository(Post)
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

  async updateOne(updateDto: UpdateDto, post: Post): Promise<Post> {
    const entity = new Post();

    entity.title = updateDto.title;
    entity.body = updateDto.body;

    if ('image' in updateDto) {
      entity.image = updateDto.image;
    }

    if ('categoryId' in updateDto) {
      const identifierDto: IdentifierDto = {
        id: Number(updateDto.categoryId)
      };

      entity.category = await this.categoriesService.getOne(identifierDto, {} as GetOneDtoCategory);
    }

    await this.repository.update(post.id, entity);

    const identifierDto: IdentifierDto = {
      id: post.id
    };

    return await this.getOneById(identifierDto, {
      scope: ['category', 'user']
    } as GetOneDto);
  }

  async deleteOne(identifierDto: IdentifierDto, post: Post): Promise<Post> {
    await this.repository.delete(identifierDto.id);

    return post;
  }
}
