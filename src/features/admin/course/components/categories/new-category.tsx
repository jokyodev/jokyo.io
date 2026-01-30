"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NewCategory = () => {
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const createCategory = useMutation(
    trpc.category.create.mutationOptions({
      onSuccess: () => {
        setName("");
        toast.success("Tạo danh mục thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.category.getAll.queryKey(),
        });
        setOpen(false);
      },
      onError: () => {
        toast.error(
          "Tạo danh mục thất bại , vui lòng kiểm tra lại tên danh mục",
        );
      },
    }),
  );
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Thêm
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm danh mục</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(event: any) => {
            setName(event.target.value);
          }}
          placeholder="Nextjs,React,Tailwindcss..."
        />
        <Button
          disabled={createCategory.isPending}
          onClick={() => {
            createCategory.mutate({
              name: name,
            });
          }}
        >
          {createCategory.isPending ? (
            <div className="flex items-center gap-1">
              <Loader2 className="animate-spin w-4 h-4" /> Xin chờ...
            </div>
          ) : (
            <>Thêm danh mục</>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewCategory;
