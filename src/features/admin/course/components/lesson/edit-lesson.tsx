"use client";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import VideoUploader from "@/features/admin/uploader/components/video-uploader";
import {
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zod-schemas/lesson-schema";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { RouterOutputs } from "@/trpc/init";
import { toast } from "sonner";
import { ChevronLeft, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LessonType = RouterOutputs["lessonRouter"]["getOne"];

interface iAppProps {
  courseId: string;
  lesson: LessonType;
}

const EditLesson = ({ courseId, lesson }: iAppProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateLesson = useMutation(
    trpc.lessonRouter.update.mutationOptions({
      onSuccess: () => {
        toast.error("Cập nhật bài học thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getOne.queryKey({
            courseId: courseId,
          }),
        });
        router.push(`/admin/courses/edit/${courseId}`);
      },
      onError: (error) => {
        toast.error("Cập nhật bài học thất bại");
      },
    }),
  );

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name,
      duration: lesson?.duration?.toString() || "0",
      videoKey: lesson?.videoKey || "",
    },
  });

  const onSubmit = (values: LessonSchemaType) => {
    if (!lesson) return;
    console.log(values);
    updateLesson.mutateAsync({
      lessonId: lesson.id,
      data: {
        name: values.name,
        videoKey: values.videoKey,
        duration: values.duration,
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-1">
          <Link href={`/admin/courses/edit/${courseId}`}>
            <ChevronLeft size={22} className="cursor-pointer" />
          </Link>
          Chỉnh sửa bài học - {lesson?.name}{" "}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <p>{JSON.stringify(lesson, null, 2)}</p> */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên bài học</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="duration"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời lượng khóa học ( giây ) </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="videoKey"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video key</FormLabel>
                  <FormControl>
                    <VideoUploader
                      value={field.value}
                      onComplete={({ videoKey, duration }) => {
                        field.onChange?.(videoKey);
                        form.setValue("duration", duration);
                        console.log("Change file");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={updateLesson.isPending}>
              {updateLesson.isPending ? (
                <div className="flex items-center gap-1">
                  <Loader className="animate-spin w-4 h-4" />
                  Đang cập nhật...
                </div>
              ) : (
                <>Cập nhật khóa học</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditLesson;
