/** @format */

import { MigrationInterface, QueryRunner } from 'typeorm';
import * as faker from 'faker';

export class Users1612284757306 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const values = [...Array(5)].map(() => [
      null,
      null,
      faker.name.findName(),
      faker.name.jobTitle(),
      faker.random.boolean() ? faker.random.number({ min: 0, max: 667 }) + '.jpg' : null,
      faker.internet.email(),
      null
    ]);

    await queryRunner.query(
      'INSERT INTO Users (googleId, facebookId, name, biography, avatar, email, password) VALUES ?',
      [values]
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM Users');
  }
}
