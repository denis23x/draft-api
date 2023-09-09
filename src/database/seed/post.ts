/** @format */

import { PrismaClient, Category } from '../client';
import { faker } from '@faker-js/faker';

/** TS Cloud Issue */

declare const process: {
  env: {
    APP_ENV: 'local' | 'cloud';
    APP_ORIGIN: string;
    GCS_ORIGIN: string;
    GCS_BUCKET: string;
  };
};

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

  // prettier-ignore
  const imagePathCloud: string[] = [process.env.GCS_ORIGIN, process.env.GCS_BUCKET, 'upload', 'images', 'seed'];
  const imagePathLocal: string[] = [process.env.APP_ORIGIN, 'images', 'seed'];

  const imagePathMap: any = {
    cloud: imagePathCloud,
    local: imagePathLocal
  };

  const imagePath: string = imagePathMap[process.env.APP_ENV].join('/');
  const imageFile = (): string => {
    return [imagePath, faker.number.int({ min: 1, max: 128 }) + '.webp'].join('/');
  };

  const raw: any[] = [];

  for (let i: number = 0; i < categoriesDB.length * 10; i++) {
    const categoryIndex: number = faker.number.int({ min: 0, max: categoriesDB.length - 1 });
    const category: Category = categoriesDB[categoryIndex];

    raw.push({
      name: faker.music.songName(),
      description: faker.lorem.sentence(),
      markdown: faker.lorem.paragraphs(10),
      image: faker.datatype.boolean() ? imageFile() : null,
      userId: category.userId,
      categoryId: category.id
    });
  }

  return raw;
};
