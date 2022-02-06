/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `Token` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Token` DROP COLUMN `expiredAt`,
    ADD COLUMN `expire` DATETIME(0) NOT NULL,
    MODIFY `fingerprint` VARCHAR(255) NOT NULL;
