/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './users.dto';
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
    entity.categories = [];

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

  async getAll(getAllDto?: GetAllDto): Promise<User[]> {
    let query: SelectQueryBuilder<User> = getRepository(User)
      .createQueryBuilder('user')
      .orderBy('user.id', 'DESC');

    if (!!getAllDto) {
      const exact: boolean = 'exact' in getAllDto && !!getAllDto.exact;
      const op: string = exact ? '=' : 'like';
      const parameter = (column: string): string => (exact ? column : '%' + column + '%');

      if ('scope' in getAllDto) {
        if (getAllDto.scope.includes('categories')) {
          query = query
            .addOrderBy('categories.id', 'DESC')
            .leftJoinAndSelect('user.categories', 'categories');
        }

        if (getAllDto.scope.includes('posts')) {
          query = query.addOrderBy('posts.id', 'DESC').leftJoinAndSelect('user.posts', 'posts');
        }
      }

      if ('name' in getAllDto) {
        query = query.where('user.name ' + op + ' :name', {
          name: parameter(getAllDto.name)
        });
      }

      if ('email' in getAllDto) {
        query = query[getAllDto.name ? 'andWhere' : 'where']('user.email ' + op + ' :email', {
          email: parameter(getAllDto.email)
        });
      }
    }

    return await this.helperService.pagination(query, getAllDto);
  }

  async getOne(idDto: IdDto, getOneDto?: GetOneDto, credentials?: boolean): Promise<User> {
    let query: SelectQueryBuilder<User> = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: idDto.id });

    if (!!getOneDto) {
      if ('scope' in getOneDto) {
        if (getOneDto.scope.includes('categories')) {
          query = query
            .addOrderBy('categories.id', 'DESC')
            .leftJoinAndSelect('user.categories', 'categories');
        }

        if (getOneDto.scope.includes('posts')) {
          query = query.addOrderBy('posts.id', 'DESC').leftJoinAndSelect('user.posts', 'posts');
        }
      }
    }

    if (credentials) {
      query = query.addSelect(['user.password', 'user.googleId', 'user.facebookId']);
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
