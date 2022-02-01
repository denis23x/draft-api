/** @format */

import { PrismaClient } from '@prisma/client';
import faker from '@faker-js/faker';

const prisma = new PrismaClient();

export const categoryRaw = async () => {
  /**
   * CATEGORY ENTITY
   * Create RAW category data
   */

  const usersDB = await prisma.user.findMany();

  const raw = [];

  for (let i = 0; i < usersDB.length * 10; i++) {
    const user = usersDB[faker.datatype.number({ min: 0, max: usersDB.length - 1 })];

    raw.push({
      name: faker.commerce.department() + i,
      userId: user.id
    });
  }

  return raw;
};
