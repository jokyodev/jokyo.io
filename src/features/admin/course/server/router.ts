import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
import z from "zod";

import {
  courseLevels,
  courseSchema,
  courseStatus,
} from "@/lib/zod-schemas/course-schema";
import { lessonSchema } from "@/lib/zod-schemas/lesson-schema";
import slugify from "slugify";
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
      return await prisma.$transaction(async (tx) => {
        // 1. Tìm chapter có vị trí cao nhất trong khóa học này
        const lastChapter = await tx.chapter.findFirst({
          where: {
            courseId: input.courseId,
          },
          orderBy: {
            position: "desc",
          },
          select: {
            position: true,
          },
        });

        // 2. Tính toán position mới
        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        // 3. Tạo chapter mới với position vừa tính
        return await tx.chapter.create({
          data: {
            name: input.name,
            courseId: input.courseId,
            externalLink: input?.externalLink,
            position: newPosition,
            slug: slugify(input.name, {
              lower: true,
              strict: true,
            }),
          },
        });
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
      return await prisma.$transaction(async (tx) => {
        // 1. Lấy thông tin chapter sắp xóa để biết position của nó
        const chapterToDelete = await tx.chapter.findUnique({
          where: {
            id: input.chapterId,
            courseId: input.courseId,
          },
          select: {
            position: true,
          },
        });

        if (!chapterToDelete) {
          throw new Error("Chapter không tồn tại");
        }

        // 2. Thực hiện xóa chapter
        const deletedChapter = await tx.chapter.delete({
          where: {
            id: input.chapterId,
          },
        });

        // 3. Giảm position của tất cả các chapter đứng sau nó đi 1 đơn vị
        await tx.chapter.updateMany({
          where: {
            courseId: input.courseId,
            position: {
              gt: chapterToDelete.position, // Lấy những thằng có position lớn hơn thằng vừa xóa
            },
          },
          data: {
            position: {
              decrement: 1, // position = position - 1
            },
          },
        });

        return deletedChapter;
      });
    }),
});

export const lessonRouter = createTRPCRouter({
  getOne: adminProcedure
    .input(
      z.object({
        chapterId: z.string(),
        lessonId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.lesson.findUnique({
        where: {
          id: input.lessonId,
          chapterId: input.chapterId,
        },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        chapterId: z.string(),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await prisma.$transaction(async (tx) => {
        // 1. Tìm bài học cuối cùng trong Chapter này để lấy position lớn nhất
        const lastLesson = await tx.lesson.findFirst({
          where: {
            chapterId: input.chapterId,
          },
          orderBy: {
            position: "desc",
          },
          select: {
            position: true,
          },
        });

        // 2. Tính toán position mới (nếu chưa có bài nào thì bắt đầu từ 1)
        const newPosition = lastLesson ? lastLesson.position + 1 : 1;

        // 3. Tạo bài học mới
        return await tx.lesson.create({
          data: {
            chapterId: input.chapterId,
            name: input.name,
            position: newPosition,
            // Đảm bảo bạn đã thêm trường position vào model Lesson trong schema.prisma
          },
        });
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        lessonId: z.string(),
        data: lessonSchema.partial(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.lesson.update({
        where: {
          id: input.lessonId,
        },
        data: {
          ...input.data,
          duration: Number(input.data.duration),
        },
      });
    }),

  remove: adminProcedure
    .input(
      z.object({
        chapterId: z.string(),
        lessonId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.lesson.delete({
        where: {
          id: input.lessonId,
          chapterId: input.chapterId,
        },
      });
    }),
});
