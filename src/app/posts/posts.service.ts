/** @format */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { CreateDto, GetAllDto, GetOneDto, UpdateDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { IdentifierDto } from '../core';
import { Request } from 'express';
import { User } from '../users/users.entity';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async create(createDto: CreateDto, request: Request): Promise<Post> {
    const user: User = request.user as User;
    const post: Post = await this.postsRepository.getRelatedByName(createDto, user);

    if (post) {
      throw new BadRequestException(post.title + ' already exists');
    }

    return await this.postsRepository.create(createDto, user);
  }

  async getAll(getAllDto: GetAllDto): Promise<Post[]> {
    return await this.postsRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto: GetOneDto): Promise<Post> {
    const post: Post = await this.postsRepository.getOne(identifierDto, getOneDto);

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async update(
    identifierDto: IdentifierDto,
    updateDto: UpdateDto,
    request: Request
  ): Promise<Post> {
    const user: User = request.user as User;
    const post: Post = await this.postsRepository.getRelatedById(identifierDto, user);

    if (!post) {
      throw new NotFoundException();
    }

    return await this.postsRepository.update(updateDto, post);
  }

  async delete(identifierDto: IdentifierDto, request: Request): Promise<Post> {
    const user: User = request.user as User;
    const post: Post = await this.postsRepository.getRelatedById(identifierDto, user);

    if (!post) {
      throw new NotFoundException();
    }

    return await this.postsRepository.delete(post);
  }
}
