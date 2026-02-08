import { Prisma } from "@/generated/prisma/client";

export const courseDetailSelect = {
  id: true,
  name: true,
  slug: true,
  price: true,
  category: true,
  subTitle: true,
  description: true,
  thumbnailKey: true,
  chapters: {
    select: {
      id: true,
      name: true,
      position: true,
      lessons: {
        select: {
          id: true,
          name: true,
          position: true,
          duration: true,
        },
      },
    },
    orderBy: { position: "asc" },
  },
} satisfies Prisma.CourseSelect;

export const courseSelect = {
  id: true,
  name: true,
  price: true,
  subTitle: true,
  thumbnailKey: true,
  slug: true,
} satisfies Prisma.CourseSelect;

export const enrollmentSelect = {
  course: {
    select: {
      id: true,
      name: true,
      subTitle: true,
      slug: true,
      thumbnailKey: true,
    },
  },
};

export type CourseDetail = Prisma.CourseGetPayload<{
  select: typeof courseDetailSelect;
}>;
export type CourseListItem = Prisma.CourseGetPayload<{
  select: typeof courseSelect;
}>;

export type Enrollment = Prisma.EnrollMentGetPayload<{
  select: typeof enrollmentSelect;
}>;
