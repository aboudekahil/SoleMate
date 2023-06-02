/*
  Warnings:

  - Added the required column `fit` to the `shoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `shoes` ADD COLUMN `fit` ENUM('Male', 'Female') NOT NULL;
