/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateUserDto } from './users.dto';
import { Post } from '../posts/posts.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const entity = new User();

    entity.name = createUserDto.name;
    entity.email = createUserDto.email;

    if (createUserDto.password) {
      entity.password = await hash(createUserDto.password, 10);
    }

    if (createUserDto.googleId) {
      entity.googleId = createUserDto.googleId;
    }

    if (createUserDto.facebookId) {
      entity.facebookId = createUserDto.facebookId;
    }

    return this.repository.save(entity);
  }

  async findAll(page: number, size: number, name?: string): Promise<User[]> {
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

    if (name) {
      query = query.where('user.name like :name', { name: '%' + name + '%' });
    }

    if (page && size) {
      query = query.skip((page - 1) * size).take(size);
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
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

  async findOneByEmail(email: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.email')
      .getOne();
  }

  async findOneCredentials(id: number): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password')
      .addSelect('user.googleId')
      .addSelect('user.facebookId')
      .getOne();
  }

  async delete(id: number): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
