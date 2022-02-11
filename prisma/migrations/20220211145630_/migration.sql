/*
  Warnings:

  - You are about to drop the column `expire` on the `Token` table. All the data in the column will be lost.
  - Added the required column `ip` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `expire`,
    ADD COLUMN `ip` VARCHAR(255) NOT NULL;
