/** @format */

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class Posts1617536481160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const selectCategories = await queryRunner.query('SELECT id, userId FROM Categories');
    const categories = selectCategories.map(category => ({
      userId: category.userId,
      categoryId: category.id
    }));

    const values = [...Array(categories.length * 25)].map(() => {
      const relation = categories[faker.random.number({ min: 0, max: categories.length - 1 })];

      return [
        faker.lorem.sentence(),
        faker.lorem.paragraphs(),
        faker.random.boolean() ? faker.random.number({ min: 0, max: 667 }) + '.jpg' : null,
        relation.userId,
        relation.categoryId
      ];
    });

    await queryRunner.query('INSERT INTO Posts (title, body, image, userId, categoryId) VALUES ?', [
      values
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM Posts');
  }
}
