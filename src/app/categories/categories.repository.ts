/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateCategoryDto, FindAllCategoriesDto, FindOneCategoryDto } from './categories.dto';
import { User } from '../users/users.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const entity = new Category();

    entity.name = createCategoryDto.name;
    entity.user = user;

    if (createCategoryDto.isPrivate) {
      entity.isPrivate = !!createCategoryDto.isPrivate;
    }

    return this.repository.save(entity);
  }

  async findAll(findAllCategoriesDto: FindAllCategoriesDto): Promise<Category[]> {
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

    if (findAllCategoriesDto.name) {
      query = query.where('category.name like :name', {
        name: '%' + findAllCategoriesDto.name + '%'
      });
    }

    if (findAllCategoriesDto.userId) {
      query = query[findAllCategoriesDto.name ? 'andWhere' : 'where'](
        'category.userId like :userId',
        {
          userId: findAllCategoriesDto.userId
        }
      );
    }

    if (findAllCategoriesDto.page && findAllCategoriesDto.size) {
      query = query
        .skip((findAllCategoriesDto.page - 1) * findAllCategoriesDto.size)
        .take(findAllCategoriesDto.size);
    }

    return await query.getMany();
  }

  async findOneById(findOneCategoryDto: FindOneCategoryDto): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: findOneCategoryDto.id })
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

  async findOneRelatedToUser(createCategoryDto: CreateCategoryDto, user: User): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.name = :name', { name: createCategoryDto.name })
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
