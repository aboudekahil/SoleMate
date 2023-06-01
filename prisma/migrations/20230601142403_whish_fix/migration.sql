/*
  Warnings:

  - The values [Wish] on the enum `users_payment_option` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `payment_option` ENUM('OMT', 'Whish', 'Both') NOT NULL;
