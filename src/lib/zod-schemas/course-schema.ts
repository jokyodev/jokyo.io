import { z } from "zod";

export const courseLevels = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "ALL_LEVELS",
] as const;

export const courseStatus = ["PRIVATE", "PUBLISH"] as const;

export const courseSchema = z.object({
  // Thông tin cơ bản
  name: z
    .string()
    .min(5, { error: "Tên khóa học phải có ít nhất 5 ký tự" })
    .max(100, { error: "Tên khóa học không được vượt quá 100 ký tự" }),
  slug: z.string().min(1, { error: "Slug không được bỏ trống" }),

  subTitle: z
    .string()
    .min(10, { error: "Phần giới thiệu ngắn phải có ít nhất 10 ký tự" })
    .max(255, { error: "Phần giới thiệu quá dài" }),
  description: z
    .string()
    .min(20, { error: "Mô tả chi tiết phải có ít nhất 20 ký tự" }),
  thumbnailKey: z
    .string()
    .min(1, { error: "Thumbnail key không được để trống" }),

  categoryId: z.string().min(1, { error: "Vui lòng chọn danh mục khóa học" }),

  level: z.enum(courseLevels, { error: "Vui lòng chọn cấp độ cho khóa học" }),

  status: z.enum(courseStatus, { error: "Vui lòng chọn cấp độ khóa học" }),

  price: z.string().min(1, { error: "Giá bán không được để trống" }),

  resourcesLinks: z
    .string()
    .min(1, { error: "Link tài nguyên không được để trống" }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
