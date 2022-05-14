/*
  Warnings:

  - You are about to drop the `FileAvatar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `FileAvatar` DROP FOREIGN KEY `FileAvatar_userId_fkey`;

-- DropTable
DROP TABLE `FileAvatar`;
