/** @format */

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class Categories1612292017709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const select = await queryRunner.query('SELECT id FROM users');
    const users = select.map(user => user.id);

    const values = [...Array(users.length * 5)].map(() => [
      faker.commerce.department(),
      users[faker.random.number({ min: 0, max: users.length - 1 })]
    ]);

    await queryRunner.query('INSERT INTO categories (name, userId) VALUES ?', [values]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM categories');
  }
}
