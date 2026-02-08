import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
import { CACHE_KEYS } from "@/lib/cache-keys";
import { redis } from "@/lib/redis";
import {
  CourseDetail,
  courseDetailSelect,
  CourseListItem,
  courseSelect,
  Enrollment,
  enrollmentSelect,
} from "../types";
import { getOrSetCache } from "@/lib/cache";

import type { EnrollMent } from "@/generated/prisma/client";

export const clientCourseRouter = createTRPCRouter({
  // FIX: Đảm bảo luôn trả về Mảng để Client dùng được .map()
  getAll: protectedProcedure.query(async () => {
    const cacheKey = "allcourses:v1";

    // Ép kiểu mảng ở đây: <CourseListItem[]>
    const cachedCourses = await redis.get<CourseListItem[]>(cacheKey);
    if (cachedCourses) return cachedCourses;

    const courses = await prisma.course.findMany({
      where: { status: "PUBLISH" },
      select: courseSelect,
    });

    if (courses.length > 0) {
      await redis.set(cacheKey, courses, { ex: 10000 });
    }

    return courses || [];
  }),

  getOne: baseProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const cacheKey = CACHE_KEYS.course.detail(input.slug);
      let course = await redis.get<CourseDetail>(cacheKey);

      if (!course) {
        course = await prisma.course.findUnique({
          where: { slug: input.slug },
          select: courseDetailSelect,
        });

        if (course) {
          await redis.set(cacheKey, course, { ex: 24 * 60 * 60 });
        }
      }

      return course; // Có thể là null, Client check if(!data)
    }),

  checkEnrollment: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const cacheKey = `user:${ctx.auth.user.id}:course:${input.courseId}:enrolled:v1`;

      return getOrSetCache(
        cacheKey,
        60 * 5, // recommend: 5 phút thôi (permission data)
        async () => {
          return prisma.enrollMent.findUnique({
            where: {
              userId_courseId: {
                userId: ctx.auth.user.id,
                courseId: input.courseId,
              },
            },
          });
        },
      );
    }),

  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cacheKey = `purchasedCourse:v1:${ctx.auth.user.id}`;

      // Tạo bản ghi trước
      const newEnroll = await prisma.enrollMent.create({
        data: {
          userId: ctx.auth.user.id,
          courseId: input.courseId,
        },
      });

      // Xóa cache ngay sau khi tạo thành công
      await redis.del(cacheKey);

      return newEnroll;
    }),

  purchasedCourses: protectedProcedure.query(async ({ ctx }) => {
    const cacheKey = `purchasedCourse:v1:${ctx.auth.user.id}`;

    let enrollments = await redis.get<Enrollment[]>(cacheKey);

    if (enrollments !== null && enrollments.length !== 0) {
      console.log("Redis", enrollments);
      const courses = enrollments.map((e) => e.course);
      return courses;
    }

    enrollments = await prisma.enrollMent.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
      include: enrollmentSelect,
    });

    await redis.set(cacheKey, enrollments, { ex: 10000 });

    const courses = enrollments.map((e) => e.course);
    console.log("Khoa hoc da mua", enrollments);
    return courses;
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
