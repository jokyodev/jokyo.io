"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlayCircle, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface iAppProps {
  courseId: string;
  courseSlug: string;
}

const CourseEnrollChecker = ({ courseId, courseSlug }: iAppProps) => {
  const trpc = useTRPC();
  const router = useRouter();

  // 1. Check xem đã mua chưa
  const {
    data: enrollment,
    isLoading: isCheckingEnroll,
    refetch: refetchCheckingEnrollment,
  } = useQuery(trpc.clientCourse.checkEnrollment.queryOptions({ courseId }));

  // 2. Lấy bài học để "Học tiếp" (Chỉ thực sự cần khi đã enroll)
  const {
    data: continueLesson,
    isLoading: isFetchingProgress,
    refetch: refetchContinueLesson,
  } = useQuery({
    ...trpc.learnRouter.getContinueLesson.queryOptions({
      slug: courseSlug,
    }),
    enabled: !!enrollment, // Thêm các option khác ở đây
  });

  // 3. Mutation đăng ký
  const enrollMutation = useMutation(
    trpc.clientCourse.enroll.mutationOptions({
      onSuccess: () => {
        toast.success("Đăng ký khóa học thành công!");
        refetchCheckingEnrollment();
        refetchContinueLesson();
      },
      onError: (err) => {
        toast.error(err.message || "Có lỗi xảy ra khi đăng ký");
      },
    }),
  );

  const handleStartLearn = () => {
    if (!continueLesson?.lessonId) {
      toast.error("Không tìm thấy bài học phù hợp");
      return;
    }
    router.push(`/learn/${courseSlug}/${continueLesson.lessonId}`);
  };

  // Trạng thái Loading ban đầu khi chưa biết User có quyền hay không
  if (isCheckingEnroll) {
    return (
      <Button disabled className="w-full bg-slate-100 text-slate-400">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Đang kiểm tra...
      </Button>
    );
  }

  return (
    <div className="w-full">
      {!enrollment ? (
        // NÚT ĐĂNG KÝ
        <Button
          disabled={enrollMutation.isPending}
          onClick={() => enrollMutation.mutate({ courseId })}
          className="w-full font-bold transition-all active:scale-95"
          size="lg"
        >
          {enrollMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          Đăng ký khóa học
        </Button>
      ) : (
        <Link
          href="/dashboard/my-courses"
          className={buttonVariants({
            className: "w-full",
          })}
        >
          Xem khóa học
        </Link>
      )}
    </div>
  );
};

export default CourseEnrollChecker;
