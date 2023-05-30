-- CreateTable
CREATE TABLE `cities` (
    `city_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `cities_name_key`(`name`),
    PRIMARY KEY (`city_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `feedback_id` VARCHAR(36) NOT NULL,
    `content` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`feedback_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `review_id` VARCHAR(36) NOT NULL,
    `customer_service_rating` INTEGER NOT NULL,
    `shipping_time_rating` INTEGER NOT NULL,
    `shipping_quality_rating` INTEGER NOT NULL,
    `website_performance_rating` INTEGER NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,
    `shoe_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoe_images` (
    `image_id` VARCHAR(36) NOT NULL,
    `image_url` VARCHAR(400) NOT NULL,
    `image_type` ENUM('Front', 'Back', 'Sides 1', 'Sides 2', 'Tag', 'Insole', 'Box Front', 'Box Tag', 'Box date', 'Other') NOT NULL,
    `shoe_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoe_sizes` (
    `shoesize_id` VARCHAR(36) NOT NULL,
    `shoe_size` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `shoe_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`shoesize_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shoes` (
    `shoe_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `condition` ENUM('New', 'Barely worn', 'Worn') NOT NULL,
    `color` VARCHAR(255) NOT NULL,
    `owner_id` VARCHAR(36) NOT NULL,

    PRIMARY KEY (`shoe_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `family_name` VARCHAR(255) NOT NULL,
    `email_address` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `payment_option` ENUM('OMT', 'Wish', 'Both') NOT NULL,
    `phone_number` VARCHAR(15) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `building` VARCHAR(255) NOT NULL,
    `apartment` VARCHAR(255) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `is_verified` BOOLEAN NOT NULL DEFAULT false,
    `city_id` INTEGER NOT NULL,

    UNIQUE INDEX `users_email_address_key`(`email_address`),
    UNIQUE INDEX `users_phone_number_key`(`phone_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `omt_payments` (
    `omt_payment_id` VARCHAR(36) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `omt_payments_value_key`(`value`),
    UNIQUE INDEX `omt_payments_user_id_key`(`user_id`),
    PRIMARY KEY (`omt_payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `whish_payments` (
    `whish_payment_id` VARCHAR(36) NOT NULL,
    `value` VARCHAR(255) NOT NULL,
    `user_id` VARCHAR(36) NOT NULL,

    UNIQUE INDEX `whish_payments_value_key`(`value`),
    UNIQUE INDEX `whish_payments_user_id_key`(`user_id`),
    PRIMARY KEY (`whish_payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_shoe_id_fkey` FOREIGN KEY (`shoe_id`) REFERENCES `shoes`(`shoe_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoe_images` ADD CONSTRAINT `shoe_images_shoe_id_fkey` FOREIGN KEY (`shoe_id`) REFERENCES `shoes`(`shoe_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoe_sizes` ADD CONSTRAINT `shoe_sizes_shoe_id_fkey` FOREIGN KEY (`shoe_id`) REFERENCES `shoes`(`shoe_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `shoes` ADD CONSTRAINT `shoes_owner_id_fkey` FOREIGN KEY (`owner_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`city_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `omt_payments` ADD CONSTRAINT `omt_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `whish_payments` ADD CONSTRAINT `whish_payments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
