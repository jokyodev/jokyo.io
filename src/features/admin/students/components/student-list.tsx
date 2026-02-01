"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"; // Để format ngày tháng cho đẹp
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Ban, Eye, Trash } from "lucide-react";

const StudentList = () => {
  const trpc = useTRPC();
  const { data: students, isLoading } = useQuery(
    trpc.studentRouter.getAll.queryOptions(),
  );
  console.log("students", students);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="rounded-md border p-10 mt-1">
      <div className="flex items-center gap-x-2 mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Danh sách học viên
        </h3>
        {/* Hiển thị số lượng bên trong một chiếc Badge nhỏ */}
        <div className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {students?.length || 0}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-62.5">Thứ tự</TableHead>
            <TableHead className="w-62.5">Sinh viên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tham gia</TableHead>
            <TableHead>Khóa học đã mua</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students?.map((student: any, index: number) => (
            <TableRow key={student.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.image || ""} alt={student.name} />
                  <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{student.name}</span>
              </TableCell>
              {/* Cột Email */}
              <TableCell>{student.email}</TableCell>
              {/* Cột Vai trò */}
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {student.role || "Student"}
                </Badge>
              </TableCell>
              {/* Cột Trạng thái Bị cấm (Banned) */}
              <TableCell>
                {student.banned ? (
                  <Badge variant="destructive">Bị khóa</Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  >
                    Hoạt động
                  </Badge>
                )}
              </TableCell>
              {/* Cột Ngày tạo */}
              <TableCell className="text-slate-500 text-xs">
                {format(new Date(student.createdAt), "hh:mm aa - dd/MM/yyyy")}
              </TableCell>

              <TableCell>1</TableCell>
              <TableCell className="flex items-center gap-1">
                <Button>
                  <Ban />
                </Button>
                <Button>
                  <Eye />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {students?.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Chưa có sinh viên nào trong danh sách.
        </div>
      )}
    </div>
  );
};

export default StudentList;
