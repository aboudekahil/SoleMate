/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `user_session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `user_session_user_id_key` ON `user_session`(`user_id`);
