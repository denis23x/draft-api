/** @format */

import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '../client';

export const userRaw = async (): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const prisma: PrismaClient<any> = new PrismaClient();

  /**
   * USER ENTITY
   * Create RAW user data
   */

  // prettier-ignore
  const avatarPathCloud: string[] = [process.env.GCS_ORIGIN, process.env.GCS_BUCKET, 'upload', 'images', 'seed'];
  const avatarPathLocal: string[] = [process.env.APP_ORIGIN, 'images', 'seed'];

  const avatarPathMap: any = {
    cloud: avatarPathCloud,
    local: avatarPathLocal
  };

  const avatarPath: string = avatarPathMap[process.env.APP_ENV].join('/');
  const avatarFile = (): string => {
    return [avatarPath, faker.number.int({ min: 1, max: 128 }) + '.webp'].join('/');
  };

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

    raw.push({
      name: faker.internet.userName(),
      email,
      emailConfirmed: false,
      description: faker.datatype.boolean() ? faker.person.jobTitle() : null,
      avatar: faker.datatype.boolean() ? avatarFile() : null,
      password: await hash(email, 10)
    });
  }

  return raw;
};
