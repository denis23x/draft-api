/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { FindAllDto, FindOneDto } from './posts.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repository: Repository<Post>
  ) {}

  async findAll(findAllDto: FindAllDto): Promise<Post[]> {
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
        'category.name',
        'category.createdAt',
        'category.updatedAt'
      ])
      .leftJoin('post.user', 'user')
      .leftJoin('post.category', 'category');

    if (findAllDto.title) {
      query = query.where('post.title like :title', { title: '%' + findAllDto.title + '%' });
    }

    if (findAllDto.userId) {
      query = query[findAllDto.title ? 'andWhere' : 'where']('post.userId like :userId', {
        userId: findAllDto.userId
      });
    }

    if (findAllDto.categoryId) {
      query = query[findAllDto.title || findAllDto.userId ? 'andWhere' : 'where'](
        'post.categoryId like :categoryId',
        {
          categoryId: findAllDto.categoryId
        }
      );
    }

    if (findAllDto.page && findAllDto.size) {
      query = query.skip((findAllDto.page - 1) * findAllDto.size).take(findAllDto.size);
    }

    return await query.getMany();
  }

  async findOneById(findOneDto: FindOneDto): Promise<Post> {
    const query = getRepository(Post)
      .createQueryBuilder('post')
      .where('post.id = :id', { id: findOneDto.id })
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
        'category.name',
        'category.createdAt',
        'category.updatedAt'
      ])
      .leftJoin('post.user', 'user')
      .leftJoin('post.category', 'category');

    return await query.getOne();
  }
}
