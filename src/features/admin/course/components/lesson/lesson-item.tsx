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
import PreviewLesson from "./preview-lesson";
import axios from "axios";

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

  const createDeleteVideoUrl = useMutation(
    trpc.videoRouter.createDeleteVideoUrl.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa video bài học thành công");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Xóa bài học thất bại , vui lòng kiểm tra lại hệ thống");
      },
    }),
  );

  const handleDelete = async () => {
    await removeLesson.mutateAsync({
      chapterId: lesson.chapterId,
      lessonId: lesson.id,
    });
    const { accessKey, deleteVideoUrl } =
      await createDeleteVideoUrl.mutateAsync({
        guid: lesson.videoKey,
      });
    try {
      const response = await axios.delete(deleteVideoUrl, {
        headers: {
          AccessKey: accessKey,
        },
      });
      console.log("<<<<", response);
    } catch (error) {
      toast.error("Có lỗi xảy ra , vui lòng thử lại sau");
    }
  };
  return (
    <div
      key={lesson.id}
      className="flex items-center justify-between gap-x-2  border  p-3 rounded-lg text-sm group bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center gap-2">
        <PlayCircle className="h-4 w-4   transition" />
        <span className="font-medium  truncate">{lesson.name}</span>
      </div>

      <div className="flex items-center gap-x-2 text-slate-500">
        {/* Nút Xem (Preview) - Chỉ hiện khi có Video */}
        {lesson?.videoKey && <PreviewLesson videoKey={lesson.videoKey} />}

        {/* Nút Chỉnh sửa (Edit) */}
        <Link
          href={`/admin/courses/edit/${courseId}/${lesson.chapterId}/${lesson.id}`}
          className={buttonVariants({
            size: "icon",
          })}
          title="Chỉnh sửa bài học"
        >
          <Pencil size={16} />
        </Link>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="icon">
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
            <Button
              size="icon"
              onClick={handleDelete}
              disabled={removeLesson.isPending}
              variant="destructive"
            >
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
