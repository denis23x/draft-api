/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { LoginDto } from '../auth/auth.dto';
import { IdentifierDto } from '../core';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  /* UTILITY */

  async getCredentials(user: User): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user.id })
      .addSelect(['user.password', 'user.googleId', 'user.facebookId']);

    return await query.getOne();
  }

  async getByEmail(createDto: CreateDto | LoginDto): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createDto.email })
      .addSelect(['user.email'])
      .addSelect([
        'categories.id',
        'categories.name',
        'categories.isPrivate',
        'categories.createdAt',
        'categories.updatedAt'
      ])
      .leftJoin('user.categories', 'categories');

    return await query.getOne();
  }

  /* CRUD */

  async create(createDto: CreateDto): Promise<User> {
    const entity = new User();

    entity.name = createDto.name;
    entity.email = createDto.email;

    if ('password' in createDto) {
      entity.password = await hash(createDto.password, 10);
    }

    if ('googleId' in createDto) {
      entity.googleId = createDto.googleId;
    }

    if ('facebookId' in createDto) {
      entity.facebookId = createDto.facebookId;
    }

    return await this.repository.save(entity);
  }

  async getAll(getAllDto: GetAllDto): Promise<User[]> {
    let query = getRepository(User)
      .createQueryBuilder('user')
      .orderBy('user.id', 'DESC')
      .select([
        'user.id',
        'user.name',
        'user.avatar',
        'user.biography',
        'user.createdAt',
        'user.updatedAt'
      ]);

    if ('scope' in getAllDto) {
      if (getAllDto.scope.includes('categories')) {
        query = query
          .addSelect([
            'categories.id',
            'categories.name',
            'categories.isPrivate',
            'categories.createdAt',
            'categories.updatedAt'
          ])
          .leftJoin('user.categories', 'categories');
      }

      if (getAllDto.scope.includes('posts')) {
        query = query
          .addSelect([
            'posts.id',
            'posts.title',
            'posts.image',
            'posts.createdAt',
            'posts.updatedAt'
          ])
          .leftJoin('user.posts', 'posts');
      }
    }

    if ('name' in getAllDto) {
      if ('exact' in getAllDto && !!getAllDto.exact) {
        query = query.where('user.name = :name', { name: getAllDto.name });

        return await query.getMany();
      } else {
        query = query.where('user.name like :name', { name: '%' + getAllDto.name + '%' });
      }
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

  async getOne(identifierDto: IdentifierDto, getOneDto?: GetOneDto): Promise<User> {
    let query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: identifierDto.id })
      .select([
        'user.id',
        'user.name',
        'user.avatar',
        'user.biography',
        'user.createdAt',
        'user.updatedAt'
      ]);

    if (getOneDto) {
      if ('scope' in getOneDto) {
        if (getOneDto.scope.includes('categories')) {
          query = query
            .addSelect([
              'categories.id',
              'categories.name',
              'categories.isPrivate',
              'categories.createdAt',
              'categories.updatedAt'
            ])
            .leftJoin('user.categories', 'categories');
        }

        if (getOneDto.scope.includes('posts')) {
          query = query
            .addSelect([
              'posts.id',
              'posts.title',
              'posts.image',
              'posts.createdAt',
              'posts.updatedAt'
            ])
            .leftJoin('user.posts', 'posts');
        }
      }
    }

    return await query.getOne();
  }

  async update(updateDto: UpdateDto, user: User): Promise<User> {
    const userCreated: User = new User();

    if ('name' in updateDto) {
      userCreated.name = updateDto.name;
    }

    if ('biography' in updateDto) {
      userCreated.biography = updateDto.biography;
    }

    await this.repository.update(user.id, userCreated);

    return await this.getOne(user);
  }

  async delete(user: User): Promise<User> {
    await this.repository.delete(user.id);

    return user;
  }
}
