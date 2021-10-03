/** @format */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../users/users.entity';
import { Post } from '../posts/posts.entity';

@Entity({ name: 'Categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    select: false
  })
  deletedAt: Date;

  @ManyToOne('User', 'categories')
  user: User;

  @OneToMany('Post', 'category')
  posts: Post[];
}
