import { z } from "zod";

export const maintenanceSchema = z
  .object({
    maintenanceMsg: z.string().min(1, "Vui lòng nhập thông báo"),
    maintenanceStart: z.date().optional(),
    maintenanceEnd: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.maintenanceStart && data.maintenanceEnd) {
        return data.maintenanceEnd > data.maintenanceStart;
      }
      return true;
    },
    {
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      path: ["maintenanceEnd"],
    },
  );

export type MaintenanceSchemaType = z.infer<typeof maintenanceSchema>;
