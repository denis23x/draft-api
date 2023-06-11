/** @format */

import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';

export const userRaw = async () => {
  /**
   * USER ENTITY
   * Create RAW user data
   */

  const raw = [
    {
      name: 'moderator',
      email: 'moder@moder.com',
      emailConfirmed: true,
      description: 'The moderator',
      avatar: null,
      password: await hash('moder@moder.com', 10)
    }
  ];

  for (let i = 0; i < 19; i++) {
    const email = faker.internet.email().toLowerCase();
    const avatarPath = process.env.APP_ORIGIN + '/images/';
    const avatarFile = faker.datatype.number({ min: 0, max: 199 }) + '.jpg';

    raw.push({
      name: faker.internet.userName(),
      email,
      emailConfirmed: false,
      description: faker.datatype.boolean() ? faker.name.jobTitle() : null,
      avatar: faker.datatype.boolean() ? avatarPath + avatarFile : null,
      password: await hash(email, 10)
    });
  }

  return raw;
};
