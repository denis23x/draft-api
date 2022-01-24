/** @format */

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class Posts1617536481160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const selectCategories = await queryRunner.query('SELECT id, userId FROM categories');
    const categories = selectCategories.map(category => ({
      userId: category.userId,
      categoryId: category.id
    }));

    const values = [...Array(categories.length * 25)].map((value: undefined, key: number) => {
      const relation = categories[faker.random.number({ min: 0, max: categories.length - 1 })];
      const imagePath = process.env.APP_STORAGE + '/images/';
      const imageFile = faker.random.number({ min: 0, max: 667 }) + '.jpg';

      return [
        faker.lorem.sentence() + key,
        faker.lorem.paragraphs(),
        faker.random.boolean() ? imagePath + imageFile : null,
        relation.userId,
        relation.categoryId
      ];
    });

    await queryRunner.query('INSERT INTO posts (title, body, image, userId, categoryId) VALUES ?', [
      values
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM posts');
  }
}
