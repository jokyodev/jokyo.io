import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createTRPCClient } from "@trpc/client";
import z from "zod";

export const noteRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      }),
    )
    .query(async ({ input }) => {}),
});
