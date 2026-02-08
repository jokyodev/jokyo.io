"use client";

import { getVideoUrl } from "@/utils";
import { Loader2 } from "lucide-react";

interface CourseVideoProps {
  videoKey: string;
  lessonName: string;
}

const CourseVideo = ({ videoKey, lessonName }: CourseVideoProps) => {
  return (
    <div className="w-full overflow-hidden pl-5 mt-2">
      <div className="relative w-full aspect-video flex items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
        <iframe
          src={getVideoUrl(videoKey)}
          loading="lazy"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 h-full w-full "
        />
      </div>
    </div>
  );
};
``;

export default CourseVideo;
