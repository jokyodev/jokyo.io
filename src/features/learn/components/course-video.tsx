"use client";

import { useTRPC } from "@/trpc/client";
import { getVideoUrl } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CourseVideoProps {
  videoKey: string;
  lessonName: string;
  lessonId: string;
}

const TRACK_EVERY_SECONDS = 3;

export default function CourseVideo({
  videoKey,
  lessonName,
  lessonId,
}: CourseVideoProps) {
  const [isLoading, setIsLoading] = useState(true);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  // mốc lần cuối gửi API (để throttle)
  const lastSentPosition = useRef(0);
  const isSending = useRef(false);

  const trpc = useTRPC();

  const progress = useMutation(
    trpc.progressRouter.createOrUpdate.mutationOptions({
      onSuccess: (data) => {
        console.log(data);
      },
    }),
  );

  useEffect(() => {
    setIsLoading(true);
    lastSentPosition.current = 0;
  }, [videoKey]);

  useEffect(() => {
    let destroyed = false;

    const initPlayer = async () => {
      if (!iframeRef.current) return;

      const playerjs = (await import("player.js")).default;
      if (destroyed) return;

      const player: any = new playerjs.Player(iframeRef.current);
      playerRef.current = player;

      const onTimeUpdate = (data: { seconds: number; duration: number }) => {
        const currentTime = Math.floor(data.seconds);

        const duration = Math.trunc(data.duration);

        // nếu duration lỗi thì skip
        if (!duration || duration <= 0) return;

        // nếu user tua lùi, vẫn update lastPosition
        // nhưng throttle bằng TRACK_EVERY_SECONDS để khỏi spam
        const diff = Math.abs(currentTime - lastSentPosition.current);
        if (diff < TRACK_EVERY_SECONDS) return;

        if (isSending.current) return;
        isSending.current = true;

        progress.mutate(
          {
            lessonId,
            lastPosition: currentTime,
            duration,
          },
          {
            onSettled: () => {
              isSending.current = false;
            },
          },
        );

        lastSentPosition.current = currentTime;
      };

      player.on("ready", () => {
        player.on("timeupdate", onTimeUpdate as any);
      });

      return () => {
        player.off("timeupdate", onTimeUpdate as any);
      };
    };

    let cleanupFn: any;

    initPlayer().then((cleanup) => {
      cleanupFn = cleanup;
    });

    return () => {
      destroyed = true;
      cleanupFn?.();
    };
  }, [videoKey, lessonId]);

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
}
