/*
  Warnings:

  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `feedbacks` ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `shoes` ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `updatedAt` DATETIME(6) NOT NULL;

-- CreateTable
CREATE TABLE `orders` (
    `order_id` VARCHAR(36) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `order_status` VARCHAR(255) NOT NULL,
    `state` ENUM('Pending', 'Accepted', 'Rejected', 'Shipped', 'Delivered') NOT NULL DEFAULT 'Pending',
    `user_id` VARCHAR(36) NOT NULL,
    `shoe_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`order_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_shoe_id_fkey` FOREIGN KEY (`shoe_id`) REFERENCES `shoes`(`shoe_id`) ON DELETE CASCADE ON UPDATE CASCADE;
