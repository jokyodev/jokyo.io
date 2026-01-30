import {
  categoryRouter,
  chapterRouter,
  courseRouter,
} from "@/features/admin/course/server/router";
import { createTRPCRouter } from "../init";
import { imageRouter } from "@/features/admin/uploader/server/routers";
import { clientCourseRouter } from "@/features/courses/server/router";
export const appRouter = createTRPCRouter({
  image: imageRouter,
  category: categoryRouter,
  course: courseRouter,
  clientCourse: clientCourseRouter,
  chapterRouter: chapterRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
