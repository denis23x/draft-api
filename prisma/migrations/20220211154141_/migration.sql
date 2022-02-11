/*
  Warnings:

  - You are about to drop the column `device` on the `Token` table. All the data in the column will be lost.
  - Added the required column `ua` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `device`,
    ADD COLUMN `ua` VARCHAR(255) NOT NULL;
