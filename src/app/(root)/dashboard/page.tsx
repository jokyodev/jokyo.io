import CourseList from "@/features/courses/components/course-list";
import { caller } from "@/trpc/server";

const Page = async () => {
  const courses = await caller.clientCourse.getAll();
  const safeCourses = JSON.parse(JSON.stringify(courses));
  return <CourseList courses={safeCourses} />;
};

export default Page;
