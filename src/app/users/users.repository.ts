/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateDto, GetAllDto, UpdateDto } from './users.dto';
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

    if ('name' in getAllDto) {
      query = query.where('user.name like :name', { name: '%' + getAllDto.name + '%' });
    }

    if ('page' in getAllDto && 'size' in getAllDto) {
      query = query.skip((getAllDto.page - 1) * getAllDto.size).take(getAllDto.size);
    }

    return await query.getMany();
  }

  async getOneById(identifierDto: IdentifierDto): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: identifierDto.id })
      .select([
        'user.id',
        'user.name',
        'user.avatar',
        'user.biography',
        'user.createdAt',
        'user.updatedAt',
        'post.id',
        'post.title',
        'post.body',
        'post.image',
        'post.createdAt',
        'post.updatedAt',
        'category.id',
        'category.name',
        'category.createdAt',
        'category.updatedAt'
      ])
      .leftJoin('user.posts', 'post')
      .leftJoin('user.categories', 'category');

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

    return await this.getOneById(identifierDto);
  }

  async deleteProfile(user: User): Promise<User> {
    await this.repository.delete(user.id);

    return user;
  }
}
