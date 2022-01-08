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

  async createOne(createDto: CreateDto, request: Request): Promise<Post> {
    const user = request.user as User;
    const isExist = await this.postsRepository.getOneByNameRelatedToUser(createDto, user);

    if (isExist) {
      throw new BadRequestException(isExist.title + ' already exists');
    }

    return await this.postsRepository.createOne(createDto, user);
  }

  async getAll(getAllDto: GetAllDto): Promise<Post[]> {
    return await this.postsRepository.getAll(getAllDto);
  }

  async getOne(identifierDto: IdentifierDto, getOneDto: GetOneDto): Promise<Post> {
    const isExist = await this.postsRepository.getOneById(identifierDto, getOneDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }

  async updateOne(
    identifierDto: IdentifierDto,
    updateDto: UpdateDto,
    request: Request
  ): Promise<Post> {
    const user = request.user as User;
    const isExist = await this.postsRepository.getOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.postsRepository.updateOne(updateDto, isExist);
  }

  async deleteOne(identifierDto: IdentifierDto, request: Request): Promise<Post> {
    const user = request.user as User;
    const isExist = await this.postsRepository.getOneByIdRelatedToUser(identifierDto, user);

    if (!isExist) {
      throw new NotFoundException();
    }

    return await this.postsRepository.deleteOne(identifierDto, isExist);
  }
}
