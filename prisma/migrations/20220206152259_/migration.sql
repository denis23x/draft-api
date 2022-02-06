/*
  Warnings:

  - Added the required column `device` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` ADD COLUMN `device` JSON NOT NULL,
    MODIFY `fingerprint` VARCHAR(191) NOT NULL;
