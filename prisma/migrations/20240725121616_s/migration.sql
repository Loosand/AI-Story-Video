/*
  Warnings:

  - You are about to drop the column `category` on the `SensitiveWord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `SensitiveWord` DROP COLUMN `category`,
    ADD COLUMN `type` VARCHAR(191) NULL;
