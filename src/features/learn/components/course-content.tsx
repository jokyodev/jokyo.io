import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Prisma } from "@/generated/prisma/client"; // Sử dụng @prisma/client chuẩn
import { formatDuration } from "@/utils";

import { PlayCircle, Lock } from "lucide-react";
import Link from "next/link";

// BƯỚC 1: Định nghĩa Type-safe cho dữ liệu lồng nhau
type ChapterWithLessons = Prisma.ChapterGetPayload<{
  include: {
    lessons: true;
  };
}>;
type Lesson = ChapterWithLessons["lessons"][0];

interface iAppProps {
  chapters: ChapterWithLessons[];
}

const CourseContent = ({ chapters }: iAppProps) => {
  return (
    <aside className="sticky top-10  w-full overflow-y-auto border-l  scrollbar-hide">
      <div className="rounded-none border-none bg-transparent shadow-none py-0">
        {/* Header sidebar cố định bên trong vùng scroll */}

        <div className="p-3.5 flex items-center justify-between border-b sticky top-0 z-10 bg-white dark:bg-zinc-800 ">
          <p className="font-medium text-base uppercase">Nội dung khóa học</p>
          <small className="text-xs bg-zinc-500 text-zinc-100 px-3 py-1 rounded-sm">
            {chapters.length} Chương
          </small>
        </div>
        <Accordion type="multiple" className="w-full space-y-0">
          {chapters.map((chapter) => (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
              className="border-b bg-background/50"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-slate-100/80 hover:no-underline transition-all">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-semibold text-slate-700 text-left line-clamp-1">
                    {chapter.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {chapter.lessons.length} bài học
                    </span>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pb-0 bg-white">
                <div className="flex flex-col">
                  {chapter.lessons.map((lesson: Lesson) => (
                    <Link
                      key={lesson.id}
                      href={`/course/learn/${lesson.position}`}
                      className="group flex items-center gap-3 border-l-4 border-transparent px-6 py-4 transition-all hover:border-blue-500 hover:bg-blue-50/50"
                    >
                      <PlayCircle className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm text-slate-600 group-hover:text-blue-600 font-medium transition-colors">
                          {lesson.position}.{lesson.name}
                        </span>
                        {/* Ví dụ thêm thời lượng hoặc trạng thái nếu có */}
                        <span className="text-[10px] text-slate-400">
                          Video - {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </aside>
  );
};

export default CourseContent;
