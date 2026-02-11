import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

import z from "zod";
import prisma from "@/lib/db";
export const noteRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return prisma.note.findMany({
        where: {
          userId: ctx.auth.user.id,
          lessonId: input.lessonId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        content: z.string(),
        timestamp: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.note.create({
        data: {
          lessonId: input.lessonId,
          userId: ctx.auth.user.id,
          content: input.content,
          timestamp: input.timestamp,
        },
      });
    }),

  remove: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.note.delete({
        where: {
          id: input.noteId,
          userId: ctx.auth.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        noteId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.note.update({
        where: {
          id: input.noteId,
          userId: ctx.auth.user.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
});
