/** @format */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../users/users.entity';
import { Category } from '../categories/categories.entity';

@Entity({ name: 'Posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text'
  })
  body: string;

  @Column({
    nullable: true
  })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    select: false
  })
  deletedAt: Date;

  @ManyToOne('User', 'posts')
  user: User;

  @ManyToOne('Category', 'categories')
  category: Category;
}
