/** @format */

import { PrismaClient } from '@prisma/client';
import faker from '@faker-js/faker';

const prisma = new PrismaClient();

export const postRaw = async () => {
  /**
   * POST ENTITY
   * Create RAW post data
   */

  const categoriesDB = await prisma.category.findMany({
    include: {
      user: true
    }
  });

  const raw = [];

  for (let i = 0; i < categoriesDB.length * 10; i++) {
    const category = categoriesDB[faker.datatype.number({ min: 0, max: categoriesDB.length - 1 })];

    const imagePath = process.env.APP_ORIGIN + '/images/';
    const imageFile = faker.datatype.number({ min: 0, max: 667 }) + '.jpg';

    raw.push({
      title: faker.lorem.sentence() + i,
      body: faker.lorem.paragraphs(),
      image: faker.datatype.boolean() ? imagePath + imageFile : null,
      userId: category.userId,
      categoryId: category.id
    });
  }

  return raw;
};