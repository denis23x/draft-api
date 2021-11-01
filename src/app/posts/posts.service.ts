/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { FindAllDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { IdentifierDto } from '../core';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async getAll(findAllDto: FindAllDto): Promise<Post[]> {
    return await this.postsRepository.getAll(findAllDto);
  }

  async getOne(identifierDto: IdentifierDto): Promise<Post> {
    const isExist = await this.postsRepository.getOneById(identifierDto);

    if (!isExist) {
      throw new NotFoundException();
    }

    return isExist;
  }
}
