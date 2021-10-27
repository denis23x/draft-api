/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateDto, FindAllDto, UpdateDto } from './categories.dto';
import { User } from '../users/users.entity';
import { IdentifierDto } from '../core';

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

    if ('isPrivate' in createDto) {
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
        'category.isPrivate',
        'category.createdAt',
        'category.updatedAt',
        'user.id',
        'user.name',
        'user.avatar',
        'user.createdAt',
        'user.updatedAt'
      ])
      .leftJoin('category.user', 'user');

    if ('name' in findAllDto) {
      query = query.where('category.name like :name', {
        name: '%' + findAllDto.name + '%'
      });
    }

    if ('userId' in findAllDto) {
      query = query[findAllDto.name ? 'andWhere' : 'where']('category.userId like :userId', {
        userId: findAllDto.userId
      });
    }

    if ('page' in findAllDto && 'size' in findAllDto) {
      query = query.skip((findAllDto.page - 1) * findAllDto.size).take(findAllDto.size);
    }

    return await query.getMany();
  }

  async findOneById(identifierDto: IdentifierDto): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: identifierDto.id })
      .select([
        'category.id',
        'category.name',
        'category.isPrivate',
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

  async findOneByNameRelatedToUser(createDto: CreateDto, user: User): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.name = :name', { name: createDto.name })
      .andWhere('category.userId = :userId', { userId: user.id })
      .select([
        'category.id',
        'category.name',
        'category.isPrivate',
        'category.createdAt',
        'category.updatedAt',
        'category.userId'
      ]);

    return await query.getOne();
  }

  async findOneByIdRelatedToUser(identifierDto: IdentifierDto, user: User): Promise<Category> {
    const query = getRepository(Category)
      .createQueryBuilder('category')
      .where('category.id = :id', { id: identifierDto.id })
      .andWhere('category.userId = :userId', { userId: user.id })
      .select([
        'category.id',
        'category.name',
        'category.isPrivate',
        'category.createdAt',
        'category.updatedAt',
        'category.userId'
      ]);

    return await query.getOne();
  }

  async updateOne(updateDto: UpdateDto, category: Category): Promise<Category> {
    const entity = new Category();

    entity.name = updateDto.name;

    if ('isPrivate' in updateDto) {
      entity.isPrivate = !!updateDto.isPrivate;
    }

    await this.repository.update(category.id, entity);

    const identifierDto: IdentifierDto = {
      id: category.id
    };

    return this.findOneById(identifierDto);
  }

  async deleteOne(identifierDto: IdentifierDto, category: Category): Promise<Category> {
    await this.repository.delete(identifierDto.id);

    return category;
  }
}
