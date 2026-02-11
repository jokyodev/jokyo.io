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
import ImageUploader from "@/features/admin/uploader/components/image-uploader";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";

import {
  courseLevels,
  courseSchema,
  CourseSchemaType,
  courseStatus,
} from "@/lib/zod-schemas/course-schema";
import { useTRPC } from "@/trpc/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import NewCategory from "../categories/new-category";
import AllCategories from "../categories/all-categories";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import slugify from "slugify";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { RouterOutputs } from "@/trpc/init";
import { Loader2 } from "lucide-react";

type CourseType = RouterOutputs["course"]["getOne"];

interface iAppProps {
  course: CourseType;
}
const BasicInfo = ({ course }: iAppProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  const { data: categories = [] } = useQuery(
    trpc.category.getAll.queryOptions(),
  );

  const queryClient = useQueryClient();

  const updateCourse = useMutation(
    trpc.course.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.course.getAll.queryKey(),
        });
        form.reset();
        toast.success("Cập nhật khóa học thành công");
        router.push("/admin/courses");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Có lỗi xảy ra , vui lòng thử lại sau.");
      },
    }),
  );

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: course?.name,
      slug: course?.slug,
      subTitle: course?.subTitle,
      description: course?.description,
      thumbnailKey: course?.thumbnailKey,
      categoryId: course?.categoryId,
      level: course?.level,
      status: course?.status,
      price: course?.price.toString(),
      resourcesLinks: course?.resourcesLinks ?? "",
    },
  });

  const onSubmit = (values: CourseSchemaType) => {
    updateCourse.mutate({
      courseId: course?.id || "",
      data: values,
    });
  };
  const handleGenerateSlug = () => {
    const name = form.getValues("name"); // Lấy giá trị hiện tại của trường name
    if (name) {
      const generatedSlug = slugify(name, {
        lower: true, // Chuyển về chữ thường
        strict: true, // Xóa ký tự đặc biệt
        locale: "vi", // Hỗ trợ tiếng Việt
      });
      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create course</CardTitle>
        <CardDescription>
          Give your course a title and a brief overview.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("est", errors);
            })}
            className="space-y-5"
          >
            {/* NAME */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập đầy đủ tên khóa học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex gap-x-2">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <Button type="button" onClick={handleGenerateSlug}>
                      Generate slug
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả ngắn</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả ngắn về khóa học" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <RichTextEditor field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* THUMBNAIL */}
            <FormField
              control={form.control}
              name="thumbnailKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* CATEGORY */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục </FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <NewCategory />
                    <AllCategories categories={categories} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* PRICE + LEVEL */}
            <div className="grid md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá (VND)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cấp độ</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn cấp độ" />
                        </SelectTrigger>
                        <SelectContent>
                          {courseLevels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trạng thái khóa học</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn cấp độ" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="resourcesLinks"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Tài nguyên </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={` Dán link tài nguyên vào đây\n Images: https://jokyo.com/images \n snippets:https://githut.com/autosnippets
                        `}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <div className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang cập nhật
                </div>
              ) : (
                <>Cập nhật</>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
