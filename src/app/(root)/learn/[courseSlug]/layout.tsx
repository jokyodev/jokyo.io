import { ReactNode } from "react";
import Header from "./_components/header";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
import CourseContent from "@/features/learn/components/course-content"; // Đây là file chứa Sidebar của ông

import { RouterOutputs } from "@/trpc/init";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FolderOpen } from "lucide-react";

type Params = Promise<{
  courseSlug: string;
}>;

interface iAppProps {
  children: ReactNode;
  params: Params;
}

const Layout = async ({ children, params }: iAppProps) => {
  // await requireAuth();

  const { courseSlug } = await params;

  const accessPermission = await caller.learnRouter.checkAccessPermission({
    courseSlug,
  });
  if (!accessPermission) return redirect("/dashboard");

  // 1. Lấy type chuẩn từ tRPC
  type ChaptersAndLessonsOutput =
    RouterOutputs["learnRouter"]["getChaptersAndLessons"];

  // ... trong Layout ...
  const chaptersAndLessons = await caller.learnRouter.getChaptersAndLessons({
    courseSlug,
  });

  // 2. Vừa làm sạch dữ liệu (JSON), vừa giữ được Type
  const safeChaptersAndLessons = JSON.parse(
    JSON.stringify(chaptersAndLessons),
  ) as ChaptersAndLessonsOutput;

  return (
    <div className="flex flex-col h-screen w-full ">
      {/* 1. Header luôn nằm trên cùng, cố định chiều cao (ví dụ h-16 = 64px) */}
      <Header />
      <div className="flex-1 flex flex-col lg:flex-row ">
        <div className="lg:flex-7 px-3 ">{children}</div>
        <CourseContent
          courseSlug={courseSlug}
          chaptersAndLessons={safeChaptersAndLessons}
        />
      </div>
    </div>
  );
};

export default Layout;
