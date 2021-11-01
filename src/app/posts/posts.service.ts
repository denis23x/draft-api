/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { GetAllDto, GetOneDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { IdentifierDto } from '../core';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

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
}
