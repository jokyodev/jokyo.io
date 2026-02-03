/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'DROPPED');

-- CreateTable
CREATE TABLE "EnrollMent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "EnrollMent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnrollMent_userId_idx" ON "EnrollMent"("userId");

-- CreateIndex
CREATE INDEX "EnrollMent_courseId_idx" ON "EnrollMent"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "EnrollMent_userId_courseId_key" ON "EnrollMent"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- AddForeignKey
ALTER TABLE "EnrollMent" ADD CONSTRAINT "EnrollMent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrollMent" ADD CONSTRAINT "EnrollMent_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
