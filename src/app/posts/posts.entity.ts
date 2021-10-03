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

@Entity({ name: 'posts' })
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

  @ManyToOne(() => User, user => user.posts)
  user: User;

  @ManyToOne(() => Category, category => category.posts)
  category: Category;
}
