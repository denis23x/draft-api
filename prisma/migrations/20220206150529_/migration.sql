/*
  Warnings:

  - Added the required column `fingerprint` to the `Token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `categoryId` INTEGER NULL,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Token` ADD COLUMN `fingerprint` JSON NOT NULL,
    MODIFY `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Token` ADD CONSTRAINT `Token_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
