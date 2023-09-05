/** @format */

import { PrismaClient } from '../client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export const categoryRaw = async () => {
  /**
   * CATEGORY ENTITY
   * Create RAW category data
   */

  const usersDB = await prisma.user.findMany();

  const raw = [];

  for (let i = 0; i < usersDB.length * 10; i++) {
    const user = usersDB[faker.number.int({ min: 0, max: usersDB.length - 1 })];

    raw.push({
      name: faker.commerce.department(),
      description: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      userId: user.id
    });
  }

  return raw;
};
