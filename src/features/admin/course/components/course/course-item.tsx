import { Button, buttonVariants } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";

import { RouterOutputs } from "@/trpc/init";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { buttonGroupVariants } from "@/components/ui/button-group";

type CourseType = RouterOutputs["course"]["getAll"][number];

interface iAppProps {
  course: CourseType;
}
const CourseItem = ({ course }: iAppProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const removeCourse = useMutation(
    trpc.course.remove.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa khóa học thành công");
        queryClient.invalidateQueries({
          queryKey: trpc.course.getAll.queryKey(),
        });
      },
      onError: (error) => {
        console.log(error);
        toast.error("Xóa khóa học thất bại");
      },
    }),
  );
  const handleRemove = (courseId: string) => {
    removeCourse.mutate({
      courseId,
    });
  };
  return (
    <TableRow key={course.id} className="transition-colors">
      <TableCell>
        <div className="font-semibold text-primary">{course.name}</div>
        <div className="text-xs text-muted-foreground truncate max-w-62.5">
          {course.slug}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={course.status === "PUBLISH" ? "default" : "outline"}
          className={
            course.status === "PUBLISH"
              ? "bg-green-600 dark:bg-green-500 hover:bg-green-600"
              : ""
          }
        >
          {course.status}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm font-medium italic">{course.level}</span>
      </TableCell>
      <TableCell className="font-mono">
        {new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(course.price))}
      </TableCell>

      <TableCell className="font-mono">
        <Badge
          variant={course.status === "PUBLISH" ? "default" : "outline"}
          className={
            course.status === "PUBLISH"
              ? "bg-blue-600 dark:bg-blue-500 hover:bg-blue-600"
              : ""
          }
        >
          {course.category.name}
        </Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="text-sm font-medium text-muted-foreground hover:text-primary hover:underline transition-all">
          <div className="space-x-1">
            <Link
              href={`/admin/courses/edit/${course?.id}`} // Thêm slug vào URL
              className={buttonVariants({
                variant: "outline", // Sử dụng variant của Shadcn để tự động tương thích Dark Mode
                size: "icon",
                className: "hover:bg-blue-500 hover:text-white transition-all",
              })}
            >
              <Pencil className="h-4 w-4" />
            </Link>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="icon"
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Bạn có chắc muốn xóa khóa học này?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Nếu tiếp tục , khóa học này sẽ bị xóa vĩnh viễn
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Đóng</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleRemove(course.id)}
                    variant="destructive"
                  >
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CourseItem;
