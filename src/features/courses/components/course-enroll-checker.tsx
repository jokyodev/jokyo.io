"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface iAppProps {
  courseId: string;
  courseSlug: string;
}

const CourseEnrollChecker = ({ courseId, courseSlug }: iAppProps) => {
  const trpc = useTRPC();

  const { data: enrollMent, isLoading } = useQuery(
    trpc.clientCourse.checkEnrollment.queryOptions({
      courseId: courseId,
    }),
  );
  const enroll = useMutation(
    trpc.clientCourse.enroll.mutationOptions({
      onSuccess: () => {
        toast.success("Đăng ký khóa học thành công");
      },
    }),
  );
  return (
    <div>
      {!enrollMent ? (
        <Button
          disabled={enroll.isPending}
          onClick={() => {
            enroll.mutate({
              courseId: courseId,
            });
          }}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
            </>
          ) : (
            <>Đăng ký khóa học</>
          )}
        </Button>
      ) : (
        <Link
          href={`/learn/${courseSlug}`}
          className={buttonVariants({
            className: "w-full",
          })}
        >
          Vào học ngay
        </Link>
      )}
    </div>
  );
};

export default CourseEnrollChecker;
