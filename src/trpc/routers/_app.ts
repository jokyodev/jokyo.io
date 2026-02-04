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
import { studentRouter } from "@/features/admin/students/server/router";
import { settingRouter } from "@/features/settings/server/router";
import { learnRouter } from "@/features/learn/server/router";
export const appRouter = createTRPCRouter({
  image: imageRouter,
  category: categoryRouter,
  course: courseRouter,
  clientCourse: clientCourseRouter,
  chapterRouter: chapterRouter,
  lessonRouter: lessonRouter,
  videoRouter: videoRouter,
  studentRouter: studentRouter,
  settingRouter: settingRouter,
  learnRouter: learnRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
