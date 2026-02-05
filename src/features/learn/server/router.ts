import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import prisma from "@/lib/db";
import { CACHE_KEYS } from "@/lib/cache-keys";
import { redis } from "@/lib/redis";

import type { Prisma } from "@/generated/prisma/client";

const courseDetailSelect = {
  id: true,
};

type Course = Prisma.CourseGetPayload<{
  select: typeof courseDetailSelect;
}>;

export const learnRouter = createTRPCRouter({
  checkEnrollement: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.course.structure(input.slug);

      let course = await redis.get<Course>(cacheKey);

      if (!course) {
        course = await prisma.course.findUnique({
          where: {
            slug: input.slug,
          },
          select: courseDetailSelect,
        });
      }
      if (!course) {
        return null;
      }
      await redis.set(cacheKey, course, { ex: 86400 });

      const enrollment = await prisma.enrollMent.findFirst({
        where: {
          userId: ctx.auth.user.id,
          courseId: course.id,
        },
      });
      if (!enrollment) {
        return null;
      }
      return course;
    }),
  getContinueLesson: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // 1. Tìm Course ID từ Slug
      const course = await prisma.course.findUnique({
        where: { slug: input.slug },
        select: { id: true },
      });
      if (!course) return null;

      // 2. Kiểm tra Enrollment
      const enrollment = await prisma.enrollMent.findUnique({
        where: {
          userId_courseId: { userId: ctx.auth.user.id, courseId: course.id },
        },
      });
      if (!enrollment) return null;

      // 3. ƯU TIÊN 1: Tìm bản ghi tiến độ MỚI NHẤT (bất kể hoàn thành hay chưa)
      // Cái này giúp user quay lại đúng cái họ vừa tắt trình duyệt xong
      const lastActivity = await prisma.userProgress.findFirst({
        where: {
          userId: ctx.auth.user.id,
          lesson: { chapter: { courseId: course.id } },
        },
        orderBy: { updatedAt: "desc" },
        include: {
          lesson: {
            select: {
              id: true,
              chapter: { select: { slug: true } },
            },
          },
        },
      });

      if (lastActivity) {
        return {
          lessonId: lastActivity.lesson.id,
          chapterSlug: lastActivity.lesson.chapter.slug,
          startPosition: lastActivity.lastPosition,
        };
      }

      // 4. ƯU TIÊN 2: Nếu chưa có tiến độ gì, lấy bài đầu tiên của khóa học
      const firstLesson = await prisma.lesson.findFirst({
        where: { chapter: { courseId: course.id } },
        orderBy: [{ chapter: { position: "asc" } }, { position: "asc" }],
        select: {
          id: true,
          chapter: { select: { slug: true } },
        },
      });

      if (!firstLesson) return null;

      return {
        lessonId: firstLesson.id,
        chapterSlug: firstLesson.chapter.slug,
        startPosition: 0,
      };
    }),
});
