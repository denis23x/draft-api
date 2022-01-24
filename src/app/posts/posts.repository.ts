/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { HelperService, IdDto } from '../core';
import { User } from '../users/users.entity';
import { CategoriesRepository } from '../categories/categories.repository';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly helperService: HelperService
  ) {}

  async create(createDto: CreateDto, user: User): Promise<Post> {
    const post: Post = new Post();

    post.title = createDto.title;
    post.body = createDto.body;

    if ('image' in createDto) {
      post.image = createDto.image;
    }

    const idDto: IdDto = {
      id: Number(createDto.categoryId)
    };

    post.category = await this.categoriesRepository.getOne(idDto);

    delete user.categories;

    post.user = user;

    return await this.repository.save(post);
  }

  async getAll(getAllDto: GetAllDto): Promise<Post[]> {
    let query: SelectQueryBuilder<Post> = getRepository(Post)
      .createQueryBuilder('post')
      .orderBy('post.id', 'DESC')
      .select(['post.id', 'post.title', 'post.image', 'post.createdAt', 'post.updatedAt']);

    if ('scope' in getAllDto) {
      if (getAllDto.scope.includes('user')) {
        query = query.leftJoinAndSelect('post.user', 'user');
      }

      if (getAllDto.scope.includes('category')) {
        query = query.leftJoinAndSelect('post.category', 'category');
      }
    }

    const exact: boolean = 'exact' in getAllDto && !!getAllDto.exact;
    const op: string = exact ? '=' : 'like';
    const parameter = (column: string): string => (exact ? column : '%' + column + '%');

    if ('title' in getAllDto) {
      query = query.where('post.title ' + op + ' :title', { title: parameter(getAllDto.title) });
    }

    if ('userId' in getAllDto) {
      query = query[getAllDto.title ? 'andWhere' : 'where']('post.userId = :userId', {
        userId: getAllDto.userId
      });
    }

    if ('categoryId' in getAllDto) {
      query = query[getAllDto.title || getAllDto.userId ? 'andWhere' : 'where'](
        'post.categoryId = :categoryId',
        {
          categoryId: getAllDto.categoryId
        }
      );
    }

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(idDto: IdDto, getOneDto?: GetOneDto): Promise<Post> {
    let query: SelectQueryBuilder<Post> = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id: idDto.id })
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

  async update(idDto: IdDto, updateDto: UpdateDto): Promise<Post> {
    const postCreated: Post = new Post();

    if ('title' in updateDto) {
      postCreated.title = updateDto.title;
    }

    if ('body' in updateDto) {
      postCreated.body = updateDto.body;
    }

    if ('image' in updateDto) {
      postCreated.image = updateDto.image;
    }

    if ('categoryId' in updateDto) {
      const idDto: IdDto = {
        id: Number(updateDto.categoryId)
      };

      postCreated.category = await this.categoriesRepository.getOne(idDto);
    }

    await this.repository.update(idDto.id, postCreated);

    const getOneDto: GetOneDto = {
      scope: ['category', 'user']
    };

    return await this.getOne(idDto, getOneDto);
  }

  async delete(idDto: IdDto): Promise<void> {
    await this.repository.delete(idDto.id);
  }
}
