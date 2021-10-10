/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateDto, FindAllDto, FindOneDto } from './categories.dto';
import { User } from '../users/users.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async create(createDto: CreateDto, user: User): Promise<Category> {
    const entity = new Category();

    entity.name = createDto.name;
    entity.user = user;

    if (createDto.isPrivate) {
      entity.isPrivate = !!createDto.isPrivate;
    }

    return this.repository.save(entity);
  }

  async findAll(findAllDto: FindAllDto): Promise<Category[]> {
    let query = getRepository(Category)
      .createQueryBuilder('category')
      .orderBy('category.id', 'DESC')
      .select([
        'category.id',
        'category.name',
        'category.createdAt',
        'category.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt'
      ])
      .leftJoin('category.user', 'user');

    if (findAllDto.name) {
      query = query.where('category.name like :name', {
        name: '%' + findAllDto.name + '%'
      });
    }

    if (findAllDto.userId) {
      query = query[findAllDto.name ? 'andWhere' : 'where']('category.userId like :userId', {
        userId: findAllDto.userId
      });
    }

    if (findAllDto.page && findAllDto.size) {
      query = query.skip((findAllDto.page - 1) * findAllDto.size).take(findAllDto.size);
    }

    return await query.getMany();
  }

  async findOneById(findOneDto: FindOneDto): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: findOneDto.id })
      .select([
        'category.id',
        'category.name',
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

  async findOneByIdRelatedToUser(createDto: CreateDto, user: User): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.name = :name', { name: createDto.name })
      .andWhere('category.userId = :userId', { userId: user.id })
      .select([
        'category.id',
        'category.name',
        'category.createdAt',
        'category.updatedAt',
        'category.userId'
      ]);

    return await query.getOne();
  }
}
