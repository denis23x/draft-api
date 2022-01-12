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
    post.user = user;

    if ('image' in createDto) {
      post.image = createDto.image;
    }

    const idDto: IdDto = {
      id: Number(createDto.categoryId)
    };

    post.category = await this.categoriesRepository.getOne(idDto);

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

    // TODO: rewrite

    // if ('name' in getAllDto && 'email' in getAllDto) {
    //   if ('exact' in getAllDto && !!getAllDto.exact) {
    //     query = query
    //       .where('user.name = :name', { name: getAllDto.name })
    //       .orWhere('user.email = :email', { email: getAllDto.email });
    //
    //     return await query.getMany();
    //   } else {
    //     query = query
    //       .where('user.name like :name', { name: '%' + getAllDto.name + '%' })
    //       .orWhere('user.email = :email', { email: '%' + getAllDto.email + '%' });
    //   }
    // }

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
