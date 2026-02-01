import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/init";
import {
  Eye,
  GripVertical,
  Link2,
  Pencil,
  PlayCircle,
  Trash,
} from "lucide-react";

import NewChapter from "../chapter/new-chapter";
import RemoveChapter from "../chapter/remove-chapter";
import NewLesson from "../lesson/new-lesson";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { buttonGroupVariants } from "@/components/ui/button-group";
import ChapterList from "../chapter/chapter-list";

type CourseType = RouterOutputs["course"]["getOne"];

interface iAppProps {
  course: CourseType;
}

const CourseStructure = ({ course }: iAppProps) => {
  if (!course) return null;

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-xl">Cấu trúc khóa học</CardTitle>
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
