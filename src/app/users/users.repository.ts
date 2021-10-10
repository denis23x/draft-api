/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateDto, DeleteDto, FindAllDto, FindOneByIdDto } from './users.dto';
import { LoginDto } from '../auth/auth.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  async create(createDto: CreateDto): Promise<User> {
    const entity = new User();

    entity.name = createDto.name;
    entity.email = createDto.email;

    if (createDto.password) {
      entity.password = await hash(createDto.password, 10);
    }

    if (createDto.googleId) {
      entity.googleId = createDto.googleId;
    }

    if (createDto.facebookId) {
      entity.facebookId = createDto.facebookId;
    }

    return this.repository.save(entity);
  }

  async findAll(findAllDto: FindAllDto): Promise<User[]> {
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

    if (findAllDto.name) {
      query = query.where('user.name like :name', { name: '%' + findAllDto.name + '%' });
    }

    if (findAllDto.page && findAllDto.size) {
      query = query.skip((findAllDto.page - 1) * findAllDto.size).take(findAllDto.size);
    }

    return await query.getMany();
  }

  async findOneById(findOneByIdDto: FindOneByIdDto): Promise<User> {
    const query = getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: findOneByIdDto.id })
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

  async findOneByIdCredentials(findOneByIdDto: FindOneByIdDto): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: findOneByIdDto.id })
      .addSelect('user.password')
      .addSelect('user.googleId')
      .addSelect('user.facebookId')
      .getOne();
  }

  async findOneByEmail(createDto: CreateDto | LoginDto): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createDto.email })
      .addSelect('user.email')
      .getOne();
  }

  async delete(deleteDto: DeleteDto): Promise<UpdateResult> {
    return this.repository.softDelete(deleteDto.id);
  }
}
