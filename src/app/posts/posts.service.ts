/** @format */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { IdDto } from '../core';
import { Request } from 'express';
import { User } from '../users/users.entity';
import { Category } from '../categories/categories.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(request: Request, createDto: CreateDto): Promise<Post> {
    const user: User = request.user as User;
    const category: Category = user.categories.find((category: Category) => {
      return category.id === createDto.categoryId;
    });

    if (!category) {
      throw new ForbiddenException();
    }

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
    const category: Category = user.categories.find((category: Category) => {
      return category.id === updateDto.categoryId;
    });

    if (!category) {
      throw new ForbiddenException();
    }

    return await this.postsRepository.update(idDto, updateDto);
  }

  async delete(request: Request, idDto: IdDto): Promise<Post> {
    const user: User = request.user as User;

    const getOneDto: GetOneDto = {
      scope: ['category']
    };

    const post: Post = await this.postsRepository.getOne(idDto, getOneDto);

    const category: Category = user.categories.find((category: Category) => {
      return category.id === post.category.id;
    });

    if (!category) {
      throw new ForbiddenException();
    }

    await this.postsRepository.delete(idDto);

    return post;
  }
}
