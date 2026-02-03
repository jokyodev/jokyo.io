import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CourseBreadcrumb } from "./breadcrumb";

import { RouterOutputs } from "@/trpc/init";
import { cn } from "@/lib/utils";
import CourseDescription from "./course-description";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { formatPrice, getImageUrl, getVideoUrl } from "@/utils";
import CourseEnrollChecker from "./course-enroll-checker";

type CourseType = RouterOutputs["clientCourse"]["getOne"];

interface iAppProps {
  course: CourseType;
}
const CourseDetail = ({ course }: iAppProps) => {
  return (
    <div className="">
      <CourseBreadcrumb
        items={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
          {
            label: course?.category.name || "Không xác định",
            href: "",
          },
          {
            label: course?.name || "",
            href: "",
          },
        ]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        <Card>
          <CardHeader>
            <CardTitle>{course?.name}</CardTitle>
            <CardDescription>{course?.subTitle}</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle>Mô tả khóa học</CardTitle>
            <CourseDescription content={course?.description} />
          </CardContent>
        </Card>
        <Card className="border py-5 sticky top-5">
          <CardHeader>
            Đăng ký khóa học
            <img src={getImageUrl(course?.thumbnailKey || "")} />
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 1. THÔNG TIN KHÓA HỌC: Lấy trực tiếp từ props `course` đã được cache ở Server */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-muted-foreground">Giá khóa học:</span>
                <span className="font-bold text-xl text-primary">
                  {Number(course?.price) === 0
                    ? "Miễn phí"
                    : `${formatPrice(Number(course?.price))?.toLocaleString()}đ`}
                </span>
              </div>

              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Truy cập toàn bộ 33 bài học</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Cung cấp mã nguồn hoàn chỉnh cho dự án</span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Không quảng cáo trong video</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="size-4 text-emerald-500" />
                  <span>Hỗ trợ hỏi đáp</span>
                </div>
              </div>
            </div>

            {/* 2. THÀNH PHẦN ĐỘNG: Check trạng thái thanh toán/đã mua */}
            {/* Component này sẽ gọi tRPC client bên trong nó */}
            {/* <EnrollmentActions courseId={course.id} price={course.price} /> */}

            <CourseEnrollChecker />

            <p className="text-[10px] text-center text-muted-foreground italic">
              Đảm bảo an toàn 100%. Thanh toán qua chuyển khoản hoặc ví điện tử.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseDetail;
