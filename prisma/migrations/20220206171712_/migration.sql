/*
  Warnings:

  - A unique constraint covering the columns `[fingerprint,userId]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Token_fingerprint_userId_key` ON `Token`(`fingerprint`, `userId`);

-- RenameIndex
ALTER TABLE `Token` RENAME INDEX `Token_userId_fkey` TO `Token_userId_idx`;
