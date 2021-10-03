/** @format */

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class Users1612284757306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const imagePath = process.env.APP_STORAGE + '/images/';
    const imageFile = faker.random.number({ min: 0, max: 667 }) + '.jpg';

    const values = [...Array(5)].map(() => {
      return [
        null,
        null,
        faker.name.findName(),
        faker.name.jobTitle(),
        faker.random.boolean() ? imagePath + imageFile : null,
        faker.internet.email(),
        null
      ];
    });

    await queryRunner.query(
      'INSERT INTO Users (googleId, facebookId, name, biography, avatar, email, password) VALUES ?',
      [values]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM Users');
  }
}
