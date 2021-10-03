/** @format */

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Tokens' })
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  expires: Date;
}
