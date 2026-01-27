import { z } from "zod";

export const courseLevel = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "ALL_LEVELS",
] as const;

export const courseSchema = z.object({
  // Thông tin cơ bản
  name: z
    .string()
    .min(5, { error: "Tên khóa học phải có ít nhất 5 ký tự" })
    .max(100, { error: "Tên khóa học không được vượt quá 100 ký tự" }),

  subtitle: z
    .string()
    .min(10, { error: "Phần giới thiệu ngắn phải có ít nhất 10 ký tự" })
    .max(255, { error: "Phần giới thiệu quá dài" })
    .optional()
    .or(z.literal("")),

  description: z
    .string()
    .min(20, { error: "Mô tả chi tiết phải có ít nhất 20 ký tự" })
    .optional()
    .or(z.literal("")),

  thumbnailKey: z
    .string()
    .min(1, { error: "Thumbnail key không được để trống" }),

  categoryId: z.string().min(1, { message: "Vui lòng chọn danh mục khóa học" }),

  level: z.enum(courseLevel, { error: "Vui lòng chọn cấp độ cho khóa học" }),

  price: z.coerce
    .number()
    .min(0, { message: "Giá tiền không được là số âm" })
    .default(0),
  isFree: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
