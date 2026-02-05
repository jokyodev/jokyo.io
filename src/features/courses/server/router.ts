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
// 1. Định nghĩa object select
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
  },
} satisfies Prisma.CourseSelect;

type Course = Prisma.CourseGetPayload<{
  select: typeof courseDetailSelect;
}>;

export const clientCourseRouter = createTRPCRouter({
  getAll: baseProcedure.query(async () => {
    return prisma.course.findMany({
      where: {
        status: "PUBLISH",
      },
      include: {
        user: true,
      },
    });
  }),
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.course.detail(input.slug);
      console.log(cacheKey);
      let course = await redis.get<Course>(cacheKey);

      if (!course) {
        course = await prisma.course.findUnique({
          where: {
            slug: input.slug,
          },
          select: courseDetailSelect,
        });
      }
      if (!course) return null;
      await redis.set(cacheKey, course, { ex: 24 * 60 * 60 });
      return course;
    }),

  checkEnrollment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = `user:${ctx.auth.user.id}:course:${input.courseId}:enrolled`;

      const cached = await redis.get(cacheKey);
      if (cached !== null) return cached === "true";

      const enrollment = await prisma.enrollMent.findUnique({
        where: {
          userId_courseId: {
            userId: ctx.auth.user.id,
            courseId: input.courseId,
          },
        },
      });
      const hasAccess = !!enrollment;

      await redis.set(cacheKey, String(hasAccess), { ex: 3600 });

      return hasAccess;
    }),

  enroll: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const cacheKey = `user:${ctx.auth.user.id}:course:${input.courseId}:enrolled`;
      await redis.del(cacheKey);

      return prisma.enrollMent.create({
        data: {
          userId: ctx.auth.user.id,
          courseId: input.courseId,
        },
      });
    }),
});
