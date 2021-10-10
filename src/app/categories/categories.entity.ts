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

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: false
  })
  isPrivate: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    select: false
  })
  deletedAt: Date;

  @ManyToOne(() => User, user => user.categories)
  user: User;

  @OneToMany(() => Post, post => post.category)
  posts: Post[];
}
