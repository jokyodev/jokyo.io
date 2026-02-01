import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface iAppProps {
  chapter: any;
}
const RemoveChapter = ({ chapter }: iAppProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const removeChapter = useMutation(
    trpc.chapterRouter.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa chapter thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: chapter.courseId,
          }),
        });
      },
      onError: () => {
        toast.error("Xóa chapter thất bại");
      },
    }),
  );
  const handleRemoveChapter = () => {
    removeChapter.mutate({
      courseId: chapter.courseId,
      chapterId: chapter.id,
    });
  };

  // return (
  //   <>
  //     {removeChapter.isPending ? (
  //       <>
  //         <Loader2 className="w-4 h-4 animate-spin" />
  //       </>
  //     ) : (
  //       <>
  //         <Trash
  //           onClick={handleRemoveChapter}
  //           size={16}
  //           className="cursor-pointer text-zinc-400"
  //         />
  //       </>
  //     )}
  //   </>
  // );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Trash
            onClick={handleRemoveChapter}
            size={16}
            className="cursor-pointer"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa chương học ({chapter.name}) </DialogTitle>
          <DialogDescription>
            Các bài học thuộc chương học này sẽ được xóa theo
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={handleRemoveChapter}
          variant="destructive"
          disabled={removeChapter.isPending}
        >
          <>
            {removeChapter.isPending ? (
              <div className="flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang xóa...
              </div>
            ) : (
              <>Xóa chương học</>
            )}
          </>
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveChapter;
