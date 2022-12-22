/*
  Warnings:

  - Added the required column `description` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `description` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `description` VARCHAR(255) NOT NULL;
