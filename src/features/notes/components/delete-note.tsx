import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
interface iAppProps {
  noteId: string;
  refetch: () => void;
}
const DeleteNote = ({ noteId, refetch }: iAppProps) => {
  const trpc = useTRPC();
  const deleteNoteMutation = useMutation(
    trpc.noteRouter.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa ghi chú thành công");
        refetch();
      },
    }),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Trash2 className="h-3 w-3 text-red-400" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn có chắc muốn xóa ghi chú này không</DialogTitle>
          <DialogDescription>
            Ghi chú này sẽ bị xóa vĩnh viễn không thể phục hồi
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            className="bg-red-500 hover:bg-red-600"
            disabled={deleteNoteMutation.isPending}
            onClick={() => deleteNoteMutation.mutate({ noteId: noteId })}
          >
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNote;
