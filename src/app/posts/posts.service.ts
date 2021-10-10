/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { FindAllDto, FindOneDto } from './posts.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async findAll(findAllDto: FindAllDto): Promise<Post[]> {
    return this.postsRepository.findAll(findAllDto);
  }

  async findOne(findOneDto: FindOneDto): Promise<Post> {
    const isExist = this.postsRepository.findOneById(findOneDto);

    if (isExist) {
      return isExist;
    }

    throw new NotFoundException();
  }
}
