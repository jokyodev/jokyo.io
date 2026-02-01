import { adminProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";
export const studentRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return prisma.user.findMany({
      where: {
        role: "user",
      },
    });
  }),
});
