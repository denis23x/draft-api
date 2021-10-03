/** @format */

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Post } from '../posts/posts.entity';
import { Category } from '../categories/categories.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column({
    nullable: true,
    select: false
  })
  googleId: string;

  @Exclude()
  @Column({
    nullable: true,
    select: false
  })
  facebookId: string;

  @Column()
  name: string;

  @Column({
    nullable: true
  })
  biography: string;

  @Column({
    nullable: true
  })
  avatar: string;

  @Exclude()
  @Column({
    unique: true,
    select: false
  })
  email: string;

  @Exclude()
  @Column({
    nullable: true,
    select: false
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    select: false
  })
  deletedAt: Date;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Category, category => category.user)
  categories: Category[];
}
