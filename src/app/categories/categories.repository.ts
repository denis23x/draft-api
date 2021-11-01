/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './categories.entity';
import { CreateDto, GetAllDto, UpdateDto } from './categories.dto';
import { User } from '../users/users.entity';
import { IdentifierDto } from '../core';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {}

  async createOne(createDto: CreateDto, user: User): Promise<Category> {
    const entity = new Category();

    entity.name = createDto.name;
    entity.user = user;

    if ('isPrivate' in createDto) {
      entity.isPrivate = !!createDto.isPrivate;
    }

    return await this.repository.save(entity);
  }

  async getAll(getAllDto: GetAllDto): Promise<Category[]> {
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

    if ('name' in getAllDto) {
      query = query.where('category.name like :name', {
        name: '%' + getAllDto.name + '%'
      });
    }

    if ('userId' in getAllDto) {
      query = query[getAllDto.name ? 'andWhere' : 'where']('category.userId like :userId', {
        userId: getAllDto.userId
      });
    }

    if ('page' in getAllDto && 'size' in getAllDto) {
      query = query.skip((getAllDto.page - 1) * getAllDto.size).take(getAllDto.size);
    }

    return await query.getMany();
  }

  async getOneById(identifierDto: IdentifierDto): Promise<Category> {
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

  async getOneByNameRelatedToUser(createDto: CreateDto, user: User): Promise<Category> {
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

  async getOneByIdRelatedToUser(identifierDto: IdentifierDto, user: User): Promise<Category> {
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

    return await this.getOneById(identifierDto);
  }

  async deleteOne(identifierDto: IdentifierDto, category: Category): Promise<Category> {
    await this.repository.delete(identifierDto.id);

    return category;
  }
}
