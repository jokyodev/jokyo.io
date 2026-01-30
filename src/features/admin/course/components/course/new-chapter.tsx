"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  chapterSchema,
  ChapterSchemaType,
} from "@/lib/zod-schemas/chapter-schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";

interface iAppProps {
  courseId: string;
}
const NewChapter = ({ courseId }: iAppProps) => {
  const trpc = useTRPC();

  const queryClient = useQueryClient();
  const createChapter = useMutation(
    trpc.chapterRouter.create.mutationOptions({
      onSuccess: () => {
        toast.success("Tạo chapter thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: courseId,
          }),
        });
        setOpen(false);
      },
      onError: () => {
        toast.error("Tạo chapter thất bại , vui lòng thử lại sau");
      },
    }),
  );

  const form = useForm<ChapterSchemaType>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: "",
      externalLink: "",
    },
  });
  const onSubmit = (values: ChapterSchemaType) => {
    createChapter.mutate({
      name: values.name,
      courseId: courseId,
      externalLink: values.externalLink,
    });
  };

  const [open, setOpen] = useState<boolean>(false);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button className="w-full mt-5">
          <Plus />
          Thêm chapter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm chapter mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tên chương học</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên chương học" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="externalLink"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tài liệu đính kèm</FormLabel>
                  <FormControl>
                    <Input
                      className=""
                      placeholder="https://example.com/link.zip"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full">Tạo ngay</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewChapter;
