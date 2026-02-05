import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
import { CACHE_KEYS } from "@/lib/cache-keys";
import { redis } from "@/lib/redis";
import { Prisma } from "@/generated/prisma/client";

// --- SELECTORS ---
export const courseDetailSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  category: true,
  subTitle: true,
  description: true,
  thumbnailKey: true,
  chapters: {
    select: {
      id: true,
      name: true,
      position: true,
      lessons: {
        select: {
          id: true,
          name: true,
          position: true,
          duration: true,
        },
      },
    },
    orderBy: { position: "asc" }, // Nên order luôn ở server
  },
} satisfies Prisma.CourseSelect;

export const courseSelect = {
  id: true,
  name: true,
  price: true,
  subTitle: true,
  thumbnailKey: true,
  slug: true,
} satisfies Prisma.CourseSelect;

// --- TYPES --- (Sửa lại kiểu Array cho đúng)
type CourseDetail = Prisma.CourseGetPayload<{
  select: typeof courseDetailSelect;
}>;
type CourseListItem = Prisma.CourseGetPayload<{ select: typeof courseSelect }>;

export const clientCourseRouter = createTRPCRouter({
  // FIX: Đảm bảo luôn trả về Mảng để Client dùng được .map()
  getAll: protectedProcedure.query(async () => {
    const cacheKey = CACHE_KEYS.course.all;

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
      const cacheKey = `user:${ctx.auth.user.id}:course:${input.courseId}:enrolled`;

      const cached = await redis.get<any>(cacheKey);
      // Nếu có cache, trả về luôn (Object hoặc null đã stringify)
      if (cached !== null) return cached;

      const enrollment = await prisma.enrollMent.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.auth.user.id,
            courseId: input.courseId,
          },
        },
      });

      // Lưu nguyên object enrollment hoặc null vào redis
      await redis.set(cacheKey, enrollment, { ex: 3600 });

      return enrollment;
    }),

  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cacheKey = `user:${ctx.auth.user.id}:course:${input.courseId}:enrolled`;

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
    const enrollments = await prisma.enrollMent.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
      include: {
        course: true,
      },
    });
    const courses = enrollments.map((e) => e.course);
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
