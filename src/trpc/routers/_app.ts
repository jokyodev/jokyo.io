import {
  categoryRouter,
  chapterRouter,
  courseRouter,
  lessonRouter,
} from "@/features/admin/course/server/router";
import { createTRPCRouter } from "../init";
import {
  imageRouter,
  videoRouter,
} from "@/features/admin/uploader/server/routers";
import { clientCourseRouter } from "@/features/courses/server/router";
export const appRouter = createTRPCRouter({
  image: imageRouter,
  category: categoryRouter,
  course: courseRouter,
  clientCourse: clientCourseRouter,
  chapterRouter: chapterRouter,
  lessonRouter: lessonRouter,
  videoRouter: videoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
