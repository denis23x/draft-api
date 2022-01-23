/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
import { LoginDto } from '../auth/auth.dto';
import { IdDto, HelperService } from '../core';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly helperService: HelperService
  ) {}

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

  async getMe(createDto: CreateDto | LoginDto, user?: User): Promise<User> {
    let query: SelectQueryBuilder<User> = getRepository(User).createQueryBuilder('user');

    if (user) {
      query = query
        .where('user.id = :id', { id: user.id })
        .addSelect(['user.password', 'user.googleId', 'user.facebookId']);

      return await query.getOne();
    }

    query = query
      .where('user.email = :email', { email: createDto.email })
      .addSelect(['user.email'])
      .addSelect([
        'categories.id',
        'categories.name',
        'categories.createdAt',
        'categories.updatedAt'
      ])
      .leftJoin('user.categories', 'categories');

    return await query.getOne();
  }

  async getAll(getAllDto: GetAllDto): Promise<User[]> {
    let query: SelectQueryBuilder<User> = getRepository(User)
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
          .addOrderBy('categories.id', 'DESC')
          .addSelect([
            'categories.id',
            'categories.name',
            'categories.createdAt',
            'categories.updatedAt'
          ])
          .leftJoin('user.categories', 'categories');
      }

      if (getAllDto.scope.includes('posts')) {
        query = query
          .addOrderBy('posts.id', 'DESC')
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

    const exact: boolean = 'exact' in getAllDto && !!getAllDto.exact;
    const op: string = exact ? '=' : 'like';
    const parameter = (column: string): string => (exact ? column : '%' + column + '%');

    if ('name' in getAllDto) {
      query = query.where('user.name ' + op + ' :name', {
        name: parameter(getAllDto.name)
      });
    }

    if ('email' in getAllDto) {
      query = query[getAllDto.name ? 'orWhere' : 'where']('user.email ' + op + ' :email', {
        email: parameter(getAllDto.email)
      });

      exact && (query = query.addSelect('user.email'));
    }

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(idDto: IdDto, getOneDto?: GetOneDto): Promise<User> {
    let query: SelectQueryBuilder<User> = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: idDto.id })
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
            .addOrderBy('categories.id', 'DESC')
            .addSelect([
              'categories.id',
              'categories.name',
              'categories.createdAt',
              'categories.updatedAt'
            ])
            .leftJoin('user.categories', 'categories');
        }

        if (getOneDto.scope.includes('posts')) {
          query = query
            .addOrderBy('posts.id', 'DESC')
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

  async update(idDto: IdDto, updateDto: UpdateDto): Promise<User> {
    const userCreated: User = new User();

    if ('name' in updateDto) {
      userCreated.name = updateDto.name;
    }

    if ('biography' in updateDto) {
      userCreated.biography = updateDto.biography;
    }

    if ('email' in updateDto) {
      userCreated.email = updateDto.email;
    }

    await this.repository.update(idDto.id, userCreated);

    return await this.getOne(idDto);
  }

  async delete(idDto: IdDto): Promise<void> {
    await this.repository.delete(idDto.id);
  }
}
