import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";

import {
  courseLevels,
  courseSchema,
  courseStatus,
} from "@/lib/zod-schemas/course-schema";
export const categoryRouter = createTRPCRouter({
  getAll: adminProcedure.query(async () => {
    return prisma.category.findMany();
  }),
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.category.create({
        data: {
          name: input.name,
        },
      });
    }),
  remove: adminProcedure
    .input(
      z.object({
        categoryId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return prisma.category.delete({
        where: {
          id: input.categoryId,
        },
      });
    }),
});

export const courseRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        categoryId: z.uuid(),
        description: z.string(),
        level: z.enum(courseLevels),
        name: z.string(),

        price: z.string(),
        slug: z.string(),
        status: z.enum(courseStatus),

        subTitle: z.string(),
        thumbnailKey: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.course.create({
        data: {
          categoryId: input.categoryId,
          description: input.description,
          level: input.level,
          name: input.name,

          price: input.price,
          slug: input.slug,
          status: input.status,

          subTitle: input.subTitle,
          thumbnailKey: input.thumbnailKey,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getAll: adminProcedure.query(async () => {
    return prisma.course.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        level: true,
        price: true,
        slug: true,

        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }),
  remove: adminProcedure
    .input(
      z.object({
        courseId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.course.delete({
        where: {
          id: input.courseId,
          userId: ctx.auth.user.id,
        },
      });
    }),

  getOne: adminProcedure
    .input(
      z.object({
        courseId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.course.findUnique({
        where: {
          id: input.courseId,
          userId: ctx.auth.user.id,
        },
        include: {
          chapters: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              lessons: {
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
          },
        },
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        courseId: z.string(),
        data: courseSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log(input.data);
      return prisma.course.update({
        where: {
          id: input.courseId,
          userId: ctx.auth.user.id,
        },
        data: input.data,
      });
    }),
});

export const chapterRouter = createTRPCRouter({
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        courseId: z.string(),
        externalLink: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.chapter.create({
        data: {
          name: input.name,
          courseId: input.courseId,
          externalLink: input?.externalLink,
        },
      });
    }),

  remove: adminProcedure
    .input(
      z.object({
        courseId: z.string(),
        chapterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.chapter.delete({
        where: {
          id: input.chapterId,
          courseId: input.courseId,
        },
      });
    }),
});
