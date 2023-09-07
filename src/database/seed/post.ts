/** @format */

import { PrismaClient, Category } from '../client';
import { faker } from '@faker-js/faker';

export const postRaw = async (): Promise<any> => {
  const prisma: PrismaClient<any> = new PrismaClient();

  /**
   * POST ENTITY
   * Create RAW post data
   */

  const categoriesDB: Category[] = await prisma.category.findMany({
    include: {
      user: true
    }
  });

  const raw: any[] = [];

  for (let i: number = 0; i < categoriesDB.length * 10; i++) {
    // prettier-ignore
    const category: Category = categoriesDB[faker.number.int({ min: 0, max: categoriesDB.length - 1 })];

    const imagePath: string = process.env.APP_ORIGIN + '/images/seed/';
    const imageFile: string = faker.number.int({ min: 1, max: 128 }) + '.webp';

    raw.push({
      name: faker.music.songName(),
      description: faker.lorem.sentence(),
      markdown: faker.lorem.paragraphs(10),
      image: faker.datatype.boolean() ? imagePath + imageFile : null,
      userId: category.userId,
      categoryId: category.id
    });
  }

  return raw;
};
