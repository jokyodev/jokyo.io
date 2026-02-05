import CourseDetail from "@/features/courses/components/course-detail";
import { caller } from "@/trpc/server";

import { redirect } from "next/navigation";

type Params = Promise<{
  courseSlug: string;
}>;

const Page = async ({ params }: { params: Params }) => {
  const { courseSlug } = await params;

  // 2. Gọi hàm đã bọc cache
  const course = await caller.clientCourse.getOne({ slug: courseSlug });

  if (!course) {
    redirect("/dashboard");
  }

  const safeCourse = JSON.parse(JSON.stringify(course));

  return (
    <div className="px-4 sm:px-6 mt-3">
      <CourseDetail course={safeCourse} />
    </div>
  );
};

export default Page;
