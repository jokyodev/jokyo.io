import SectionLabel from "@/components/section-label";
import CourseList from "@/features/courses/components/course-list";
import PurchasedList from "@/features/courses/components/purchased-list";
import { caller, trpc } from "@/trpc/server";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowUpRightIcon, Folder } from "lucide-react";
import Link from "next/link";
import { buttonGroupVariants } from "@/components/ui/button-group";
const Page = async () => {
  const purchasedCourses = await caller.clientCourse.purchasedCourses();

  const safeCourses = JSON.parse(JSON.stringify(purchasedCourses));

  return (
    <div>
      {purchasedCourses.length >= 1 ? (
        <>
          <SectionLabel text="Khóa học đã mua" />
          <PurchasedList courses={safeCourses} />
        </>
      ) : (
        <div className="col-span-full w-full py-12 flex items-center justify-center rounded-xl  ">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-white shadow-sm border">
                <Folder className="text-slate-400" />
              </EmptyMedia>
              <EmptyTitle>Chưa có khóa học nào</EmptyTitle>
              <EmptyDescription>
                Danh sách khóa học đã mua của bạn đang trống. Hãy bắt đầu hành
                trình học tập ngay hôm nay!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-row justify-center gap-3">
              <Link href="/dashboard" className={buttonVariants({})}>
                Tìm khóa học
              </Link>
              <Button variant="outline" className="bg-white">
                Xem khuyến mãi
              </Button>
            </EmptyContent>
            <Button
              variant="link"
              asChild
              className="text-muted-foreground mt-2"
              size="sm"
            >
              <a href="#" className="flex items-center gap-1">
                Tìm hiểu chính sách hoàn tiền{" "}
                <ArrowUpRightIcon className="w-4 h-4" />
              </a>
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};

export default Page;
