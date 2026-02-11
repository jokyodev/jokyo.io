"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RouterOutputs } from "@/trpc/init";
import { Play, Clock, AudioLines } from "lucide-react";
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

  // ✅ Xác định chapter hiện tại để tự động mở
  const currentChapterId = useMemo(() => {
    if (!lessonId) return "";
    const chapter = chaptersAndLessons?.chapters.find((ch) =>
      ch.lessons.some((ls) => ls.id === lessonId),
    );
    return chapter?.id ?? "";
  }, [chaptersAndLessons, lessonId]);

  const [openChapters, setOpenChapters] = useState<string[]>([]);

  // ✅ Tự động mở chapter khi vào bài học
  useEffect(() => {
    if (!currentChapterId) return;
    setOpenChapters((prev) => {
      if (prev.includes(currentChapterId)) return prev;
      return [...prev, currentChapterId];
    });
  }, [currentChapterId]);

  const totalLessons = useMemo(
    () =>
      chaptersAndLessons?.chapters.reduce(
        (acc, ch) => acc + ch.lessons.length,
        0,
      ) ?? 0,
    [chaptersAndLessons],
  );

  return (
    /**
     * sticky top-4: Dính vào đỉnh trang khi cuộn (cách 16px)
     * h-[calc(100vh-2rem)]: Chiều cao tối đa bằng màn hình để tự cuộn bên trong
     * flex flex-col: Chia Header và List riêng biệt
     */
    <div className="flex-2 p-3 sticky top-4 h-[calc(100vh-2.5rem)] flex flex-col overflow-hidden">
      {/* --- PHẦN HEADER (ĐỨNG YÊN) --- */}
      <div className="mb-6 shrink-0 bg-background">
        <h2 className="text-2xl font-bold mb-2">Nội dung khóa học</h2>
        <p className="text-sm text-muted-foreground italic">
          {chaptersAndLessons?.chapters.length ?? 0} chương • {totalLessons} bài
          học
        </p>
      </div>

      {/* --- PHẦN DANH SÁCH (TỰ CUỘN KHI QUÁ DÀI) --- */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <Accordion
          type="multiple"
          className="space-y-2 pb-10" // Padding bottom để không bị che khuất bài cuối
          value={openChapters}
          onValueChange={setOpenChapters}
        >
          {chaptersAndLessons?.chapters.map((chapter, index) => (
            <AccordionItem
              key={chapter.id}
              value={chapter.id}
              className="border rounded-lg bg-card overflow-hidden shadow-xs transition-all"
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-accent/50 transition-colors border-b">
                <div className="flex items-start gap-3 text-left w-full">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold mb-0.5 line-clamp-2 leading-tight">
                      {chapter.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {chapter.lessons.length} bài học
                    </p>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-2 pb-2 bg-muted/30">
                <div className="space-y-1 mt-2">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const isCurrentLesson = lesson.id === lessonId;

                    return (
                      <Link
                        href={`/learn/${courseSlug}/${lesson.id}`}
                        key={lesson.id}
                        scroll={false}
                        className={`group flex items-center gap-3 p-3 rounded-md border transition-all ${
                          isCurrentLesson
                            ? "border-green-500 bg-green-50/50 dark:bg-green-950/20 shadow-sm"
                            : "bg-background border-transparent hover:border-border hover:bg-accent"
                        }`}
                      >
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                            isCurrentLesson
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-muted"
                          }`}
                        >
                          {isCurrentLesson ? (
                            <AudioLines
                              size={14}
                              className="text-green-600 animate-pulse"
                            />
                          ) : (
                            <Play
                              size={12}
                              className="text-muted-foreground group-hover:text-primary transition-colors"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium mb-0.5 line-clamp-1 ${
                              isCurrentLesson
                                ? "text-green-600"
                                : "text-zinc-700"
                            }`}
                          >
                            {lessonIndex + 1}. {lesson.name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <Clock size={10} />
                            {formatDuration(lesson.duration) || "10:00"}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* --- CSS TRICK ĐỂ THANH CUỘN ĐẸP --- */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}
