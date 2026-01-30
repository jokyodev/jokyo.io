import { auth } from "@/lib/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";

import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Người dùng chưa đăng nhập",
    });
  }
  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});

export const adminProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Người dùng chưa đăng nhập",
    });
  }
  // const isAdmin = session.user.role === "admin";
  // if (!isAdmin) {
  //   throw new TRPCError({
  //     code: "BAD_REQUEST",
  //     message: "Không đủ quyền để truy cập",
  //   });
  // }
  return next({
    ctx: {
      ...ctx,
      auth: session,
    },
  });
});
