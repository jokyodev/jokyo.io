import CourseList from "@/features/courses/components/course-list";
import { caller } from "@/trpc/server";

const Page = async () => {
  const courses = await caller.clientCourse.getAll();
  return <CourseList courses={courses} />;
};

export default Page;
