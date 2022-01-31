/** @format */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import faker from '@faker-js/faker';

/** https://github.com/faker-js/faker */
/** https://www.prisma.io/docs/guides/database/seed-database#integrated-seeding-with-prisma-migrate */

const prisma = new PrismaClient();

const main = async () => {
  /**
   * CLEANUP
   * Clear all tables in right order
   */

  const deletePosts = prisma.post.deleteMany();
  const deleteCategories = prisma.category.deleteMany();
  const deleteUsers = prisma.user.deleteMany();

  await prisma.$transaction([deletePosts, deleteCategories, deleteUsers]);

  /**
   * USER ENTITY
   *
   */

  const users = [];

  for (let i = 0; i < 20; i++) {
    const email = faker.internet.email().toLowerCase();
    const avatarPath = process.env.APP_STORAGE + '/images/';
    const avatarFile = faker.datatype.number({ min: 0, max: 200 }) + '.jpg';

    users.push({
      name: faker.internet.userName(),
      email,
      biography: faker.name.jobTitle(),
      avatar: faker.datatype.boolean() ? avatarPath + avatarFile : null,
      password: await hash(email, 10)
    });
  }

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true
  });

  /** Category entity */

  const usersDatabase = await prisma.user.findMany();

  const categories = [];

  for (let i = 0; i < users.length * 10; i++) {
    const user = usersDatabase[faker.datatype.number({ min: 0, max: users.length - 1 })];

    categories.push({
      name: faker.commerce.department() + i,
      userId: user.id
    });
  }

  await prisma.category.createMany({
    data: categories,
    skipDuplicates: true
  });

  /** Posts entity */

  const categoriesDatabase = await prisma.category.findMany({
    include: {
      user: true
    }
  });

  const posts = [];

  for (let i = 0; i < categories.length * 10; i++) {
    const category =
      categoriesDatabase[faker.datatype.number({ min: 0, max: categories.length - 1 })];

    const imagePath = process.env.APP_STORAGE + '/images/';
    const imageFile = faker.datatype.number({ min: 0, max: 667 }) + '.jpg';

    posts.push({
      title: faker.lorem.sentence() + i,
      body: faker.lorem.paragraphs(),
      image: faker.datatype.boolean() ? imagePath + imageFile : null,
      userId: category.userId,
      categoryId: category.id
    });
  }

  await prisma.post.createMany({
    data: posts,
    skipDuplicates: true
  });
};

main()
  .catch((error: any) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
