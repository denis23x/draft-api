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

  async createOne(createDto: CreateDto): Promise<User> {
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

  async getAll(getAllDto: GetAllDto): Promise<User | User[]> {
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

        return await query.getOne();
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

  async getOneById(identifierDto: IdentifierDto, getOneDto: GetOneDto): Promise<User> {
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

    return await query.getOne();
  }

  async getOneByIdWithCredentials(identifierDto: IdentifierDto): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: identifierDto.id })
      .addSelect('user.password')
      .addSelect('user.googleId')
      .addSelect('user.facebookId');

    return await query.getOne();
  }

  async getOneByEmail(createDto: CreateDto | LoginDto): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createDto.email })
      .addSelect('user.email');

    return await query.getOne();
  }

  async updateProfile(updateDto: UpdateDto, user: User): Promise<User> {
    const entity = new User();

    if ('name' in updateDto) {
      entity.name = updateDto.name;
    }

    if ('biography' in updateDto) {
      entity.biography = updateDto.biography;
    }

    await this.repository.update(user.id, entity);

    const identifierDto: IdentifierDto = {
      id: user.id
    };

    return await this.getOneById(identifierDto, {} as GetOneDto);
  }

  async deleteProfile(user: User): Promise<User> {
    await this.repository.delete(user.id);

    return user;
  }
}
