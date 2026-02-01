"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, Loader2, Pencil, PlayCircle, Trash } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface iAppProps {
  courseId: string;
  lesson: any;
}

const LessonItem = ({ courseId, lesson }: iAppProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const removeLesson = useMutation(
    trpc.lessonRouter.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa bài học thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: courseId,
          }),
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Xóa bài học thành công");
      },
    }),
  );

  const handleDelete = () => {
    removeLesson.mutateAsync({
      chapterId: lesson.chapterId,
      lessonId: lesson.id,
    });
  };
  return (
    <div
      key={lesson.id}
      className="flex items-center justify-between gap-x-2  border  p-3 rounded-lg text-sm group bg-zinc-800 hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <PlayCircle className="h-4 w-4  group-hover:text-zinc-300 transition" />
        <span className="font-medium  truncate">{lesson.name}</span>
      </div>

      <div className="flex items-center gap-x-2 text-slate-500">
        {/* Nút Xem (Preview) - Chỉ hiện khi có Video */}
        {lesson?.videoKey && (
          <Button>
            <Eye
              size={16}
              className="transition-transform group-hover:scale-110"
            />
          </Button>
        )}

        {/* Nút Chỉnh sửa (Edit) */}
        <Link
          href={`/admin/courses/edit/${courseId}/${lesson.chapterId}/${lesson.id}`}
          className={buttonVariants({})}
          title="Chỉnh sửa bài học"
        >
          <Pencil
            size={16}
            className="transition-transform group-hover:scale-110"
          />
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Trash />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xóa bài học ({lesson.name}) </DialogTitle>
              <DialogDescription>
                Video bài học cũng sẽ được xóa theo sau khi thao tác
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handleDelete} disabled={removeLesson.isPending}>
              {removeLesson.isPending ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Đang xóa...
                </div>
              ) : (
                <>Xóa bài học</>
              )}
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LessonItem;
