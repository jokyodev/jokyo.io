import CourseVideo from "@/features/learn/components/course-video";
import LearnActions from "@/features/learn/components/learn-actions";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

type Params = Promise<{
  lessonId: string;
}>;
interface iAppProps {
  params: Params;
}

const Page = async ({ params }: iAppProps) => {
  const { lessonId } = await params;

  const lesson = await caller.learnRouter.getLesson({
    lessonId: lessonId,
  });
  if (!lesson) return redirect("/dashboard");

  return (
    <div>
      <CourseVideo
        lessonId={lesson.id}
        lessonName={lesson.name}
        videoKey={lesson.videoKey!}
      />
      <LearnActions />
    </div>
  );
};

export default Page;
