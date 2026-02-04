import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import prisma from "@/lib/db";
import { CACHE_KEYS } from "@/lib/cache-keys";
import { redis } from "@/lib/redis";
import { TRPCError } from "@trpc/server";
import type { Prisma } from "@/generated/prisma/client";

type CourseWithContent = Prisma.CourseGetPayload<{
  include: {
    chapters: {
      include: { lessons: true };
    };
  };
}>;

export const learnRouter = createTRPCRouter({
  getCourse: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const cacheKey = CACHE_KEYS.course.structure(input.slug);

      let course = await redis.get<CourseWithContent>(cacheKey);

      if (!course) {
        course = await prisma.course.findUnique({
          where: {
            slug: input.slug,
          },
          include: {
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
      }
      if (!course) {
        return null;
      }
      await redis.set(cacheKey, course, { ex: 86400 });

      const enrollment = await prisma.enrollMent.findFirst({
        where: {
          userId: ctx.auth.user.id,
          courseId: (course as any).id,
        },
      });
      if (!enrollment) {
        return null;
      }
      return course;
    }),
});
