/*
  Warnings:

  - Added the required column `expires` to the `Session` table without a default value. This is not possible if the table is not empty.
  - The required column `refresh` was added to the `Session` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Session` ADD COLUMN `expires` INTEGER NOT NULL,
    ADD COLUMN `refresh` VARCHAR(255) NOT NULL;
