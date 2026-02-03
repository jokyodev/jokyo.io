import CourseList from "@/features/courses/components/course-list";
import { caller } from "@/trpc/server";
import { unstable_cache } from "next/cache";

const getCourses = unstable_cache(
  async () => {
    return await caller.clientCourse.getAll();
  },
  ["courses"], // cache key
  {
    revalidate: 600, // cache 60s
  },
);
const Page = async () => {
  const courses = await getCourses();
  const safeCourses = JSON.parse(JSON.stringify(courses));
  return <CourseList courses={safeCourses} />;
};

export default Page;
