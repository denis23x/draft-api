/*
  Warnings:

  - You are about to alter the column `ua` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Json`.
  - You are about to alter the column `ip` on the `Session` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Session` MODIFY `ua` JSON NULL,
    MODIFY `ip` JSON NULL;
