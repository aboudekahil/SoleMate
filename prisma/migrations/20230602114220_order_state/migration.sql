/*
  Warnings:

  - You are about to drop the column `order_status` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `order_status`,
    MODIFY `state` ENUM('Pending', 'Accepted', 'Rejected', 'Shipped', 'Delivered', 'Invalid') NOT NULL DEFAULT 'Pending';
