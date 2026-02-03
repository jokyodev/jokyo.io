"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton"; // Sử
import CourseItem from "./course-item";

const CourseList = () => {
  const trpc = useTRPC();

  const { data: courses, isLoading } = useQuery(
    trpc.course.getAll.queryOptions(),
  );

  if (isLoading) {
    return (
      <div className="w-full p-4 space-y-4">
        <Skeleton className="h-8 w-62.5" />
        <Skeleton className="h-75 w-full" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-1 border rounded-xl bg-card text-card-foreground shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight">
          Danh sách khóa học hiện có
        </h2>
        <Badge variant="secondary" className="font-mono">
          {courses?.length || 0} Khóa học
        </Badge>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-75">Khóa học</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Cấp độ</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Danh mục</TableHead>

              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courses?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Chưa có khóa học nào được tạo.
                </TableCell>
              </TableRow>
            ) : (
              courses &&
              courses?.map((course) => (
                <CourseItem key={course.id} course={course} />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CourseList;
