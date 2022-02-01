/** @format */

import { hash } from 'bcrypt';
import faker from '@faker-js/faker';

export const userRaw = async () => {
  /**
   * USER ENTITY
   * Create RAW user data
   */

  const raw = [];

  for (let i = 0; i < 20; i++) {
    const email = faker.internet.email().toLowerCase();
    const avatarPath = process.env.APP_STORAGE + '/images/';
    const avatarFile = faker.datatype.number({ min: 0, max: 200 }) + '.jpg';

    raw.push({
      name: faker.internet.userName(),
      email,
      biography: faker.name.jobTitle(),
      avatar: faker.datatype.boolean() ? avatarPath + avatarFile : null,
      password: await hash(email, 10)
    });
  }

  return raw;
};
