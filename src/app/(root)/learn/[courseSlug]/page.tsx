import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

type Params = Promise<{
  courseSlug: string;
}>;
interface iAppProps {
  params: Params;
}
const Page = async ({ params }: iAppProps) => {
  const { courseSlug } = await params;
  const course = await caller.learnRouter.getCourse({
    slug: courseSlug,
  });

  if (!course) return redirect("/dashboard");

  return (
    <div>
      <pre>{JSON.stringify(course, null, 2)}</pre>
    </div>
  );
};

export default Page;
