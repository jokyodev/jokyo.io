import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import prisma from "@/lib/db";
export const clientCourseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async () => {
    return prisma.course.findMany({
      where: {
        status: "PUBLISH",
      },
    });
  }),
});
