/*
  Warnings:

  - You are about to drop the column `body` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,userId,categoryId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `markdown` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Post_title_userId_categoryId_key` ON `Post`;

-- AlterTable
ALTER TABLE `Post` DROP COLUMN `body`,
    DROP COLUMN `title`,
    ADD COLUMN `markdown` TEXT NOT NULL,
    ADD COLUMN `name` VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_name_userId_categoryId_key` ON `Post`(`name`, `userId`, `categoryId`);
