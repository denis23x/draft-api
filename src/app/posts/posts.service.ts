/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Post } from './posts.entity';
import { FindAllPostsDto, FindOnePostDto } from './posts.dto';
import { PostsRepository } from './posts.repository';
import { User } from '../users/users.entity';
import { UpdateResult } from 'typeorm';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async findAll(findAllPostsDto: FindAllPostsDto): Promise<Post[]> {
    return this.postsRepository.findAll(
      findAllPostsDto.page,
      findAllPostsDto.size,
      findAllPostsDto.title,
      findAllPostsDto.userId,
      findAllPostsDto.categoryId
    );
  }

  async findOne(findOnePostDto: FindOnePostDto): Promise<Post> {
    const isExist = this.postsRepository.findOneById(Number(findOnePostDto.id));

    if (isExist) {
      return isExist;
    }

    throw new NotFoundException();
  }

  async delete(user: User): Promise<UpdateResult> {
    // const isExist = await this.postsRepository.findOneById(Number(user.id));
    //
    // if (isExist) {
    //   return this.postsRepository.delete(isExist.id);
    // }

    throw new NotFoundException();
  }
}
