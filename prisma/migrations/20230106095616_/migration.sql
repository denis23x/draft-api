/*
  Warnings:

  - Added the required column `buttons` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Settings` ADD COLUMN `buttons` VARCHAR(255) NOT NULL;
