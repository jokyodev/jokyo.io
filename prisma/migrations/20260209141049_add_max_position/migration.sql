/*
  Warnings:

  - You are about to drop the column `watchedTime` on the `UserProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "watchedTime",
ADD COLUMN     "maxPosition" INTEGER NOT NULL DEFAULT 0;
