import { z } from "zod";
import { adminProcedure, baseProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/db";

export const settingRouter = createTRPCRouter({
  // Lấy cấu hình
  getSiteConfig: baseProcedure.query(async () => {
    const config = await prisma.siteConfiguration.findUnique({
      where: { id: "global_config" },
    });
    return (
      config || {
        maintenanceMode: false,
        maintenanceMsg: "Hệ thống đang bảo trì để nâng cấp.",
        maintenanceStart: null,
        maintenanceEnd: null,
      }
    );
  }),

  // Cập nhật và tự động BẬT bảo trì
  updateMaintenance: adminProcedure
    .input(
      z.object({
        maintenanceMsg: z.string(),
        maintenanceStart: z.coerce.date(),
        maintenanceEnd: z.coerce.date(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.siteConfiguration.update({
        where: { id: "global_config" },
        data: {
          maintenanceMsg: input.maintenanceMsg,
          maintenanceStart: input.maintenanceStart,
          maintenanceEnd: input.maintenanceEnd,
          maintenanceMode: true, // Ép về true khi có cập nhật
        },
      });
    }),

  // API riêng để TẮT bảo trì (Mở cửa lại hệ thống)
  disableMaintenance: adminProcedure.mutation(async () => {
    return await prisma.siteConfiguration.update({
      where: { id: "global_config" },
      data: { maintenanceMode: false },
    });
  }),
});
