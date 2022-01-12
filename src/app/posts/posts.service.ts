/** @format */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { IdDto } from '../core';
import { Request } from 'express';
import { User } from '../users/users.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  /* UTILITY */

  async getRelated(idDto: IdDto, user: User): Promise<Post> {
    const getOneDto: GetOneDto = {
      scope: ['user']
    };

    const post: Post = await this.postsRepository.getOne(idDto, getOneDto);

    if (!post) {
      throw new NotFoundException();
    }

    if (post.user.id !== user.id) {
      throw new ForbiddenException();
    }

    return post;
  }

  async getAvailable(createDto: CreateDto | UpdateDto, user: User, idDto?: IdDto): Promise<void> {
    const getAllDto: GetAllDto = {
      title: createDto.title,
      userId: user.id,
      categoryId: createDto.categoryId,
      scope: ['category'],
      exact: 1
    };

    const post: Post[] = await this.postsRepository.getAll(getAllDto);
    const postExist: Post = post.shift();

    if (postExist) {
      if (!idDto || idDto.id !== postExist.id) {
        throw new BadRequestException(
          postExist.title + ' already exists in ' + postExist.category.name
        );
      }
    }
  }

  /* CRUD */

  async create(request: Request, createDto: CreateDto): Promise<Post> {
    const user: User = request.user as User;

    await this.getAvailable(createDto, user);

    return await this.postsRepository.create(createDto, user);
  }

  async getAll(request: Request, getAllDto: GetAllDto): Promise<Post[]> {
    return await this.postsRepository.getAll(getAllDto);
  }

  async getOne(request: Request, idDto: IdDto, getOneDto: GetOneDto): Promise<Post> {
    const post: Post = await this.postsRepository.getOne(idDto, getOneDto);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async update(request: Request, idDto: IdDto, updateDto: UpdateDto): Promise<Post> {
    const user: User = request.user as User;

    await this.getRelated(idDto, user);
    await this.getAvailable(updateDto, user, idDto);

    return await this.postsRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<Post> {
    const user: User = request.user as User;
    const post: Post = await this.getRelated(idDto, user);

    await this.postsRepository.delete(idDto);

    return post;
  }
}
