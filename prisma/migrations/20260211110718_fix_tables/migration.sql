/*
  Warnings:

  - Added the required column `finalSourceCode` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "finalSourceCode" TEXT NOT NULL;
