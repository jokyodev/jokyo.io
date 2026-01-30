import EditCourse from "@/features/admin/course/components/course/edit-course";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

type Params = Promise<{
  courseId: string;
}>;

const Page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;

  return <EditCourse courseId={courseId} />;
};

export default Page;
