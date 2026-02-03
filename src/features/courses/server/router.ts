import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";
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
      return prisma.course.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          category: true,
          chapters: {
            include: {
              lessons: true,
            },
          },
        },
      });
    }),

  checkEnrollment: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.enrollMent.findFirst({
        where: {
          userId: ctx.auth.user.id,
          courseId: input.courseId,
        },
        include: {
          course: true,
        },
      });
    }),

  enroll: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.enrollMent.create({
        data: {
          userId: ctx.auth.user.id,
          courseId: input.courseId,
        },
      });
    }),
});
