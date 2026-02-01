-- CreateEnum
CREATE TYPE "LessonStatus" AS ENUM ('PRIVATE', 'PUBLISH');

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "status" "LessonStatus" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "videoKey" TEXT;
