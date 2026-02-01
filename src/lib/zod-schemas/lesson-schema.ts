import { z } from "zod";

export const lessonStatus = ["PRIVATE", "PUBLISH"] as const;

export const lessonSchema = z.object({
  name: z.string().min(1, { error: "Tên bài học không được để trống" }),
  videoKey: z.string().optional(),
  duration: z.string().optional(),
});

export type LessonSchemaType = z.infer<typeof lessonSchema>;
