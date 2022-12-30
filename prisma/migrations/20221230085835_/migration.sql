/*
  Warnings:

  - You are about to drop the column `biography` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `biography`,
    ADD COLUMN `description` VARCHAR(255) NULL;
