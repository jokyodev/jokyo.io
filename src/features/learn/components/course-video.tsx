"use client";

import { useTRPC } from "@/trpc/client";
import { getVideoUrl } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface CourseVideoProps {
  videoKey: string;
  lessonName: string;
  lessonId: string;
}

const CourseVideo = ({ videoKey, lessonName, lessonId }: CourseVideoProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);
  const lastTrackedTime = useRef(0);

  const trpc = useTRPC();

  const createOrUpdateProgress = useMutation(
    trpc.progressRouter.createOrUpdate.mutationOptions({}),
  );

  useEffect(() => {
    setIsLoading(true);
    lastTrackedTime.current = 0;
  }, [videoKey]);

  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      if (!iframeRef.current) return;

      // ✅ Import player.js chỉ ở client
      const playerjs = (await import("player.js")).default;

      if (!isMounted) return;

      const player = new playerjs.Player(iframeRef.current);
      playerRef.current = player;

      player.on("ready", () => {
        console.log("Bunny Player Ready");

        player.on(
          "timeupdate",
          (data: { seconds: number; duration: number }) => {
            const currentTime = Math.floor(data.seconds);

            if (currentTime - lastTrackedTime.current >= 15) {
              console.log(
                `Đã xem thêm 15 giây. Tổng: ${currentTime}s / ${data.duration}s`,
              );
              createOrUpdateProgress.mutateAsync({
                lessonId: lessonId,
                lastPosition: currentTime,
              });
              lastTrackedTime.current = currentTime;
            }
          },
        );
      });
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.off("timeupdate");
      }
    };
  }, [videoKey]);

  return (
    <div className="w-full overflow-hidden mt-2">
      <div className="relative w-full aspect-video rounded-xl border bg-card overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Đang tải bài giảng...
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title={lessonName}
          src={getVideoUrl(videoKey)}
          loading="lazy"
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
};

export default CourseVideo;
