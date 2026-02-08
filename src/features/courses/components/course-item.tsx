import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RouterOutputs } from "@/trpc/init";
import {
  PlayCircle,
  Star,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkle,
} from "lucide-react";
import { formatPrice } from "@/utils";
import Link from "next/link";

type CourseType = RouterOutputs["clientCourse"]["getAll"][number];

interface iAppProps {
  course: CourseType;
}

const CourseItem = ({ course }: iAppProps) => {
  // Giả sử có dữ liệu rating, bạn có thể thay bằng data thực tế
  const rating = 4.9;
  const isBestSeller = true;

  return (
    <div className="group relative bg-card rounded-sm border border-border/50 overflow-hidden transition-all duration-500 ">
      {/* Thumbnail Section */}
      <div className="relative h-50  overflow-hidden m-2 rounded-sm">
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
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Giá
            </span>
            <div className="flex items-baseline gap-0.5 font-black">
              <span className="text-2xl tracking-tighter text-foreground">
                {Number(course.price) === 0
                  ? "Free"
                  : formatPrice(Number(course.price) ?? 0)}
              </span>

              {Number(course.price) !== 0 && (
                <span className="text-sm font-bold text-muted-foreground ml-0.5">
                  ₫
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/dashboard/course/${course.slug}`}
            className={buttonVariants({})}
          >
            Chi tiết
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseItem;
