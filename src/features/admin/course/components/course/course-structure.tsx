import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RouterOutputs } from "@/trpc/init";

import { GripVertical, Pencil, Plus, Trash } from "lucide-react";
import NewChapter from "./new-chapter";
import RemoveChapter from "./remove-chapter";
import { Button } from "@/components/ui/button";
import NewLesson from "./new-lesson";
type CourseType = RouterOutputs["course"]["getOne"];

interface iAppProps {
  course: CourseType;
}

const CourseStructure = ({ course }: iAppProps) => {
  const handleRemoveChapter = (chapterId: string) => {
    alert(chapterId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu trúc khóa học</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {course?.chapters.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Không có chapter nào , hãy tạo 1 chapter mới cho khóa học này
            </p>
          )}
          {course?.chapters.map((chapter) => (
            <div className="border rounded-lg p-5 " key={chapter.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <GripVertical />
                  <p className="font-bold">{chapter.name}</p>
                  <span> - </span>
                  <span className="text-muted-foreground text-sm">
                    {chapter.externalLink}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Pencil size={18} className="cursor-pointer" />
                  <RemoveChapter courseId={course.id} chapterId={chapter.id} />
                </div>
              </div>

              <Card className="mt-5">
                <CardHeader>
                  <CardTitle>Bài học</CardTitle>
                </CardHeader>
                <CardContent>
                  {chapter.lessons.map((lesson) => (
                    <div>{lesson.name}</div>
                  ))}
                  <NewLesson />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        <NewChapter courseId={course?.id || ""} />
      </CardContent>
    </Card>
  );
};

export default CourseStructure;
