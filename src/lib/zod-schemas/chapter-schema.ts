import { z } from "zod";

export const chapterSchema = z.object({
  name: z.string().min(1, { error: "Tên chương học không được để trống" }),
  externalLink: z.string().optional(),
});

export type ChapterSchemaType = z.infer<typeof chapterSchema>;
