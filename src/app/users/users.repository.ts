/** @format */

import { Injectable } from '@nestjs/common';
import { Repository, getRepository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from './users.entity';
import { CreateUserDto } from './users.dto';

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
      .createQueryBuilder('User')
      .orderBy('User.id', 'DESC')
      .select([
        'User.id',
        'User.name',
        'User.avatar',
        'User.biography',
        'User.createdAt',
        'User.updatedAt'
      ]);

    if (name) {
      query = query.where('User.name like :name', { name: '%' + name + '%' });
    }

    if (page && size) {
      query = query.skip((page - 1) * size).take(size);
    }

    return await query.getMany();
  }

  async findOneById(id: number): Promise<User> {
    return this.repository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('User')
      .where('User.email = :email', { email })
      .addSelect('User.email')
      .getOne();
  }

  async findOneCredentials(id: number): Promise<User> {
    return getRepository(User)
      .createQueryBuilder('User')
      .where('User.id = :id', { id })
      .addSelect('User.password')
      .addSelect('User.googleId')
      .addSelect('User.facebookId')
      .getOne();
  }

  async delete(id: number): Promise<UpdateResult> {
    return this.repository.softDelete(id);
  }
}
