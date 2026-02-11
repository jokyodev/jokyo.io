import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import prisma from "@/lib/db";

import type { Lesson } from "@/generated/prisma/client";
import { getOrSetCache } from "@/lib/cache";

export const learnRouter = createTRPCRouter({
  checkEnrollement: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await prisma.course.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          id: true,
        },
      });

      if (!course) return null;

      const enrollment = await prisma.enrollMent.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.auth.user.id,
            courseId: course.id,
          },
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

  checkAccessPermission: protectedProcedure
    .input(
      z.object({
        courseSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const course = await prisma.course.findUnique({
        where: {
          slug: input.courseSlug,
        },
        select: {
          id: true,
          name: true,
        },
      });
      if (!course) return null;

      const enrollment = await prisma.enrollMent.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.auth.user.id,
            courseId: course.id,
          },
        },
      });
      if (!enrollment) return null;

      return course;
    }),

  getLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `lesson:${input.lessonId}`;

      return getOrSetCache<Lesson | null>(cacheKey, 60 * 60 * 12, async () => {
        return prisma.lesson.findUnique({
          where: { id: input.lessonId },
        });
      });
    }),

  getChaptersAndLessons: protectedProcedure
    .input(
      z.object({
        courseSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `course:structure:v1:${input.courseSlug}`;
      return getOrSetCache(cacheKey, 12 * 60 * 60, async () => {
        return await prisma.course.findUnique({
          where: {
            slug: input.courseSlug,
          },
          select: {
            chapters: {
              orderBy: {
                position: "asc",
              },
              include: {
                lessons: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        });
      });
    }),
});

export const progressRouter = createTRPCRouter({
  createOrUpdate: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        lastPosition: z.number(),
        duration: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.user.id;

      const progress = await prisma.userProgress.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.lessonId,
          },
        },
        select: {
          id: true,
          maxPosition: true,
          isCompleted: true,
        },
      });

      // ✅ completed rồi thì vẫn update lastPosition để resume đúng
      if (progress?.isCompleted) {
        return prisma.userProgress.update({
          where: {
            userId_lessonId: {
              userId,
              lessonId: input.lessonId,
            },
          },
          data: {
            lastPosition: input.lastPosition,
          },
        });
      }

      const SEEK_THRESHOLD = 10; // giây
      const STEP_CAP = 6; // mỗi request chỉ cho maxPosition tăng tối đa 6s

      const oldMax = progress?.maxPosition ?? 0;

      let newMax = oldMax;

      if (input.lastPosition <= oldMax + SEEK_THRESHOLD) {
        // xem bình thường, tăng theo currentTime
        newMax = Math.max(oldMax, input.lastPosition);
      } else {
        // user vừa tua xa
        // KHÔNG nhảy maxPosition lên ngay
        // nhưng vẫn cho "đuổi theo" từ từ nếu họ xem thật
        newMax = oldMax + STEP_CAP;
      }

      // clamp
      newMax = Math.min(newMax, input.duration);

      const isCompleted = newMax >= input.duration * 0.8;

      return prisma.userProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: input.lessonId,
          },
        },
        update: {
          lastPosition: input.lastPosition,
          duration: input.duration,
          maxPosition: isCompleted ? input.duration : newMax,
          isCompleted,
        },
        create: {
          userId,
          lessonId: input.lessonId,
          lastPosition: input.lastPosition,
          duration: input.duration,
          maxPosition: input.lastPosition,
          isCompleted,
        },
      });
    }),
});

export const resourceRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        courseSlug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.course.findUnique({
        where: {
          slug: input.courseSlug,
        },
        select: {
          resourcesLinks: true,
        },
      });
    }),
});
