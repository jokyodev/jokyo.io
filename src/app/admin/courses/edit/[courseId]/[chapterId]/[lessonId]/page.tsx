import EditLesson from "@/features/admin/course/components/lesson/edit-lesson";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

const Page = async ({ params }: { params: Params }) => {
  const { courseId, chapterId, lessonId } = await params;

  const lesson = await caller.lessonRouter.getOne({
    chapterId: chapterId,
    lessonId: lessonId,
  });

  if (!lesson) return redirect("/admin");
  const safeLesson = JSON.parse(JSON.stringify(lesson));

  return <EditLesson courseId={courseId} lesson={safeLesson} />;
};

export default Page;
