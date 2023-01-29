-- AlterTable
ALTER TABLE `Settings` MODIFY `theme` VARCHAR(255) NOT NULL DEFAULT 'light',
    MODIFY `language` VARCHAR(255) NOT NULL DEFAULT 'en',
    MODIFY `monospace` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `buttons` VARCHAR(255) NOT NULL DEFAULT 'left';
