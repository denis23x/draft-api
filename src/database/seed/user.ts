/** @format */

import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';

export const userRaw = async (): Promise<any> => {
  /**
   * USER ENTITY
   * Create RAW user data
   */

  const raw: any[] = [
    {
      name: 'moderator',
      email: 'moder@moder.com',
      emailConfirmed: false,
      description: 'The moderator',
      avatar: null,
      password: await hash('moder@moder.com', 10)
    }
  ];

  for (let i: number = 0; i < 19; i++) {
    const email: string = faker.internet.email().toLowerCase();
    const avatarPath: string = process.env.APP_ORIGIN + '/images/seed/';
    const avatarFile: string = faker.number.int({ min: 1, max: 128 }) + '.webp';

    raw.push({
      name: faker.internet.userName(),
      email,
      emailConfirmed: false,
      description: faker.datatype.boolean() ? faker.person.jobTitle() : null,
      avatar: faker.datatype.boolean() ? avatarPath + avatarFile : null,
      password: await hash(email, 10)
    });
  }

  return raw;
};
