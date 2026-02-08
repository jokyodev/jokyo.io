"use client";
import LoadingSpinner from "@/components/loading-spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";

import { RouterOutputs } from "@/trpc/init";
import { useQuery } from "@tanstack/react-query";
import { Star, Clock, MoveRight } from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

type CourseType = RouterOutputs["clientCourse"]["getAll"][number];

interface iAppProps {
  course: CourseType;
}

const PurchasedItem = ({ course }: iAppProps) => {
  const rating = 4.9;
  const trpc = useTRPC();
  const router = useRouter();
  // 1. Lấy options
  const continueLessonOptions =
    trpc.clientCourse.getContinueLesson.queryOptions({
      slug: course.slug,
    });

  // 2. Truyền vào useQuery để thực sự lấy DATA
  const { data: continueLesson, isLoading } = useQuery(continueLessonOptions);

  // 3. Bây giờ ông mới dùng được continueLesson
  console.log(continueLesson?.lessonId);

  const handleStartLearn = () => {
    const url = `/learn/${course.slug}/${continueLesson?.lessonId}`;
    router.push(url);
  };

  return (
    <div className="group relative bg-card rounded-sm border border-border/50 overflow-hidden transition-all duration-500 ">
      {/* Thumbnail Section */}
      <div className="relative  h-50 overflow-hidden m-2 rounded-sm">
        <img
          src={`${process.env.NEXT_PUBLIC_BUNNY_IMAGES_CDN}/${course.thumbnailKey}`}
          alt={course.name}
          className="object-cover w-full h-full  "
        />
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
            <Star className="w-3 h-3 fill-amber-500" />
            <span>{rating}</span>
            <span className="text-muted-foreground font-normal">(1.2k)</span>
          </div>
          <div className="flex items-center text-muted-foreground text-[11px] gap-1">
            <Clock className="w-3 h-3" />
            <span>12h 30m</span>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-tight mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {course.name}
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-2 min-h-40px">
          {course.subTitle}
        </p>

        {/* Footer: Price & Action */}

        <Button
          className="w-full mt-3"
          onClick={handleStartLearn}
          disabled={isLoading}
        >
          <MoveRight />
          Vào học
        </Button>
      </div>
    </div>
  );
};

export default PurchasedItem;
