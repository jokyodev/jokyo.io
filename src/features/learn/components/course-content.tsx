"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouterOutputs } from "@/trpc/init";
import { Play, Clock, CheckCircle2, AudioLines } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { formatDuration } from "@/utils";

type ChaptersAndLessons = RouterOutputs["learnRouter"]["getChaptersAndLessons"];

interface iAppProps {
  chaptersAndLessons: ChaptersAndLessons;
  courseSlug: string;
}

export default function CourseContent({
  chaptersAndLessons,
  courseSlug,
}: iAppProps) {
  const params = useParams<{ lessonId?: string }>();
  const lessonId = params.lessonId;

  // ✅ chapter hiện tại đang chứa lessonId
  const currentChapterId = React.useMemo(() => {
    if (!lessonId) return "";

    const chapter = chaptersAndLessons?.chapters.find((ch) =>
      ch.lessons.some((ls) => ls.id === lessonId),
    );

    return chapter?.id ?? "";
  }, [chaptersAndLessons, lessonId]);

  // ✅ MULTIPLE => value phải là string[]
  const [openChapters, setOpenChapters] = React.useState<string[]>([]);

  // ✅ mỗi lần đổi lesson => đảm bảo chapter chứa lesson đó đang mở
  React.useEffect(() => {
    if (!currentChapterId) return;

    setOpenChapters((prev) => {
      // nếu đã mở rồi thì thôi
      if (prev.includes(currentChapterId)) return prev;

      // thêm chapter hiện tại vào list
      return [...prev, currentChapterId];
    });
  }, [currentChapterId]);

  const totalLessons =
    chaptersAndLessons?.chapters.reduce(
      (acc, ch) => acc + ch.lessons.length,
      0,
    ) ?? 0;

  return (
    <div className="flex-2 p-2 space-y-3">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Nội dung khóa học</h2>
        <p className="text-sm text-muted-foreground">
          {chaptersAndLessons?.chapters.length ?? 0} chương • {totalLessons} bài
          học
        </p>
      </div>

      <Accordion
        type="multiple"
        className="space-y-1"
        value={openChapters}
        onValueChange={setOpenChapters}
      >
        {chaptersAndLessons?.chapters.map((chapter, index) => {
          return (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
              className="border bg-card overflow-hidden transition-shadow"
            >
              <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-accent/50 transition-colors border-b">
                <div className="flex items-start gap-4 text-left w-full">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-1 line-clamp-2">
                      {chapter.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {chapter.lessons.length} bài học
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-5 pb-4">
                <div className="space-y-1 mt-2">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const currentLesson = lesson.id === lessonId;

                    return (
                      <Link
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        key={lesson.id}
                        scroll={false}
                        className={`group flex items-center gap-3 p-3  border transition-all cursor-pointer ${
                          currentLesson
                            ? "border-green-600 bg-green-200"
                            : "bg-zinc-100 dark:bg-zinc-800"
                        }`}
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted transition-colors">
                          {currentLesson ? (
                            <AudioLines size={14} className="text-green-500" />
                          ) : (
                            <Play
                              size={14}
                              className="text-muted-foreground group-hover:text-primary transition-colors"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium mb-0.5 line-clamp-1 transition-colors ${
                              currentLesson ? "text-green-600" : "text-primary"
                            }`}
                          >
                            {lessonIndex + 1}. {lesson.name}
                          </p>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span
                              className={`flex items-center gap-1 ${
                                currentLesson
                                  ? "text-green-600"
                                  : "text-zinc-500"
                              }`}
                            >
                              <Clock size={12} />
                              {formatDuration(lesson.duration) || "10:00"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
