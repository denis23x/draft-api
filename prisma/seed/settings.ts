/** @format */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const settingsRaw = async () => {
  /**
   * SETTINGS ENTITY
   * Create RAW settings data
   */

  const usersDB = await prisma.user.findMany();

  const raw = [];

  for (let i = 0; i < usersDB.length; i++) {
    const user = usersDB[i];

    raw.push({
      theme: 'AUTO',
      userId: user.id
    });
  }

  return raw;
};
