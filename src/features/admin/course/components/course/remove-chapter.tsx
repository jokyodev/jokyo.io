import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";

interface iAppProps {
  courseId: string;
  chapterId: string;
}
const RemoveChapter = ({ courseId, chapterId }: iAppProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();

  const removeChapter = useMutation(
    trpc.chapterRouter.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa chapter thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: courseId,
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
      courseId: courseId,
      chapterId: chapterId,
    });
  };

  return (
    <>
      {removeChapter.isPending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
        </>
      ) : (
        <>
          <Trash
            onClick={handleRemoveChapter}
            size={18}
            className="cursor-pointer "
          />
        </>
      )}
    </>
  );
};

export default RemoveChapter;
