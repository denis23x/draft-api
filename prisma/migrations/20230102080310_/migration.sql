/*
  Warnings:

  - You are about to alter the column `theme` on the `Settings` table. The data in that column could be lost. The data in that column will be cast from `Enum("Settings_theme")` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `Settings` MODIFY `theme` VARCHAR(255) NOT NULL;
