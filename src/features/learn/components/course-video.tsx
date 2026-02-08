"use client";

import * as React from "react";
import { getVideoUrl } from "@/utils";
import { Loader2 } from "lucide-react";

interface CourseVideoProps {
  videoKey: string;
  lessonName: string;
}

const CourseVideo = ({ videoKey, lessonName }: CourseVideoProps) => {
  React.useEffect(() => {
    // sau 10s mới call
    const timer = setTimeout(() => {
      testFunction();
    }, 10_000);

    // cleanup: đổi lesson hoặc unmount thì hủy
    return () => clearTimeout(timer);
  }, [videoKey]);

  const testFunction = () => {
    console.log("🔥 User đã xem video được 10s rồi!");
    // TODO: call API / mutation ở đây
  };

  return (
    <div className="w-full overflow-hidden px-3 mt-2">
      <div className="relative w-full aspect-video flex items-center justify-center rounded-xl border bg-card overflow-hidden">
        <iframe
          title={lessonName}
          src={getVideoUrl(videoKey)}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
};

export default CourseVideo;
