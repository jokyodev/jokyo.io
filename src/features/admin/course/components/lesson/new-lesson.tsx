import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zod-schemas/lesson-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

interface iAppProps {
  courseId: string;
  chapterId: string;
}
const NewLesson = ({ courseId, chapterId }: iAppProps) => {
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
    },
  });
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const createLesson = useMutation(
    trpc.lessonRouter.create.mutationOptions({
      onError: (error) => {
        toast.error("Có lỗi xảy ra");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: courseId,
          }),
        });
        toast.success("Tạo bài học thành công");
        setOpen(false);
      },
    }),
  );

  const [open, setOpen] = useState<boolean>(false);

  const onSubmit = (values: LessonSchemaType) => {
    console.log(values);
    createLesson.mutate({
      chapterId: chapterId,
      name: values.name,
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Tạo bài học
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm bài học</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tên bài học</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nhập tên bài học" />
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button disabled={createLesson.isPending} className="w-full">
              {createLesson.isPending ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang tạo
                </div>
              ) : (
                <>Tạo ngay</>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewLesson;
