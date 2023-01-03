/*
  Warnings:

  - Added the required column `language` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `language` VARCHAR(255) NOT NULL;
