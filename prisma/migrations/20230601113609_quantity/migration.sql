/*
  Warnings:

  - Added the required column `quantity` to the `shoe_sizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shoe_sizes` ADD COLUMN `quantity` INTEGER NOT NULL;
