"use client";
import { RichTextEditor } from "@/components/rich-editor/editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/features/uploader/components/image-uploader";
import {
  courseSchema,
  CourseSchemaType,
} from "@/lib/zod-schemas/course-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const NewCourse = () => {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      thumbnailKey: "",
      categoryId: "",
      level: "BEGINNER",
      subtitle: "",
      description: "",
      price: 0,
      isFree: false,
      isPublished: false,
    },
  });

  const onSubmit = (values: CourseSchemaType) => {};
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create course</CardTitle>
        <CardDescription>
          Give your course a title and a brief overview. Don't worry, you can
          change these details later in your course settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
          <div>
            <Form {...form}>
              <form
                className="space-y-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập đầy đủ tên khóa học"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="subtitle"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Mô tả ngắn về khóa học"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <RichTextEditor field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="description"
                  control={form.control}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Mô tả ngắn</FormLabel>
                        <FormControl>
                          <ImageUploader />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <Button>Tạo khóa học</Button>
              </form>
            </Form>
          </div>
          <div>Right side</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewCourse;
