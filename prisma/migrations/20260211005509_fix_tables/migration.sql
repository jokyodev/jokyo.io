/*
  Warnings:

  - You are about to drop the column `resourcesLink` on the `Course` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Course" DROP COLUMN "resourcesLink",
ADD COLUMN     "resourcesLinks" TEXT;
