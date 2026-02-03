import CourseDetail from "@/features/courses/components/course-detail";
import { caller } from "@/trpc/server";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";

type Params = Promise<{
  courseSlug: string;
}>;

// 1. Tách hàm cache ra ngoài và thêm slug vào Key
const getCachedCourse = (slug: string) =>
  unstable_cache(
    async () => {
      console.log("=== CACHE MISS: FETCHING COURSE ===");
      return await caller.clientCourse.getOne({ slug });
    },
    ["course-detail", slug], // Thêm slug vào đây để phân biệt các khóa học
    {
      revalidate: 6,
      tags: [`course-${slug}`],
    },
  )(); // <--- PHẢI CÓ DẤU NGOẶC NÀY ĐỂ CHẠY HÀM

const Page = async ({ params }: { params: Params }) => {
  const { courseSlug } = await params;

  // 2. Gọi hàm đã bọc cache
  const course = await getCachedCourse(courseSlug);

  // 3. Check redirect
  if (!course) {
    redirect("/dashboard");
  }

  // 4. Khử lỗi Type Date (Nếu CourseDetail nhận string)
  const safeCourse = JSON.parse(JSON.stringify(course));

  return (
    <div className="px-4 sm:px-6 mt-3">
      <CourseDetail course={safeCourse} />
    </div>
  );
};

export default Page;
