import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/init";
import {
  Book,
  Eye,
  GripVertical,
  Link2,
  Pencil,
  PlayCircle,
  Timer,
  Trash,
  Video,
} from "lucide-react";

import NewChapter from "../chapter/new-chapter";
import RemoveChapter from "../chapter/remove-chapter";
import NewLesson from "../lesson/new-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { buttonGroupVariants } from "@/components/ui/button-group";
import ChapterList from "../chapter/chapter-list";
import { useEffect, useMemo, useState } from "react";
import { formatDuration } from "@/utils";

type CourseType = RouterOutputs["course"]["getOne"];

interface iAppProps {
  course: CourseType;
}

const CourseStructure = ({ course }: iAppProps) => {
  if (!course) return null;

  const numberOfChapters = course.chapters.length;

  const numberOfLessons = useMemo(() => {
    return course.chapters.reduce(
      (total, chapter) => total + chapter.lessons.length,
      0,
    );
  }, [course.chapters]);
  const totalDuration = useMemo(() => {
    return course.chapters.reduce((acc, chapter) => {
      // Cộng dồn duration của tất cả lessons trong chapter này
      const chapterDuration = chapter.lessons.reduce((sum, lesson) => {
        return sum + (lesson.duration || 0);
      }, 0);

      return acc + chapterDuration;
    }, 0);
  }, [course.chapters]);
  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-xl flex items-center  justify-between">
          Cấu trúc khóa học
          <div className="flex items-center gap-5">
            <small className="flex items-center gap-1 text-xs text-muted-foreground">
              <Timer size={14} />
              {formatDuration(totalDuration)}
            </small>
            <small className="flex items-center gap-1 text-xs text-muted-foreground">
              <Book size={14} />
              {numberOfChapters} chương học
            </small>
            <small className="flex items-center gap-1 text-xs text-muted-foreground">
              <Video size={14} />
              {numberOfLessons} bài học
            </small>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {course.chapters.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 border rounded-xl ">
              <p className="text-muted-foreground text-sm italic">
                Chưa có chương nào. Hãy bắt đầu xây dựng nội dung ngay!
              </p>
            </div>
          )}

          <ChapterList chapters={course.chapters} />

          <div className="mt-6">
            <NewChapter courseId={course.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseStructure;
