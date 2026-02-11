"use client";

import { useVideoPlayer } from "@/context/video-player-provider";
import { useTRPC } from "@/trpc/client";
import { getVideoUrl } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface CourseVideoProps {
  videoKey: string;
  lessonName: string;
  lessonId: string;
}

const TRACK_EVERY_SECONDS = 10;
const INIT_RETRY_INTERVAL = 250; // ms
const INIT_MAX_RETRY = 20; // 20 * 250 = 5s

export default function CourseVideo({
  videoKey,
  lessonName,
  lessonId,
}: CourseVideoProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { playerRef, setCurrentTime } = useVideoPlayer();

  const lastSentPosition = useRef(0);
  const isSending = useRef(false);
  const hasRestoredPosition = useRef(false);

  const trpc = useTRPC();

  const { data: lastPositionData } = useQuery(
    trpc.progressRouter.getLastPosition.queryOptions({ lessonId }),
  );

  const progressMutation = useMutation(
    trpc.progressRouter.createOrUpdate.mutationOptions(),
  );

  // Reset flags khi đổi bài
  useEffect(() => {
    setIsLoading(true);
    setIsPlayerReady(false);

    hasRestoredPosition.current = false;
    lastSentPosition.current = 0;
    isSending.current = false;
  }, [lessonId, videoKey]);

  // Seek sau khi player ready
  useEffect(() => {
    if (
      !isPlayerReady ||
      !playerRef.current ||
      lastPositionData?.lastPosition === undefined ||
      hasRestoredPosition.current
    )
      return;

    const savedPos = lastPositionData.lastPosition;

    if (savedPos > 2) {
      try {
        playerRef.current.setCurrentTime(savedPos);
        setCurrentTime(savedPos);
      } catch {}
    }

    hasRestoredPosition.current = true;
  }, [isPlayerReady, lastPositionData, setCurrentTime, playerRef]);

  // Init playerjs: retry + cleanup đúng
  useEffect(() => {
    let destroyed = false;
    let playerInstance: any = null;

    let retryCount = 0;
    let retryTimer: any = null;

    const cleanup = () => {
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = null;

      setIsPlayerReady(false);

      if (playerInstance) {
        try {
          playerInstance.off("timeupdate");
          playerInstance.off("ready");
        } catch {}
      }

      playerInstance = null;
      playerRef.current = null;
    };

    const attachTimeUpdate = (instance: any) => {
      const onTimeUpdate = (data: { seconds: number; duration: number }) => {
        const currentTime = Math.floor(data.seconds);
        const duration = Math.trunc(data.duration);

        setCurrentTime(currentTime);

        if (!duration || duration <= 0) return;

        const diff = Math.abs(currentTime - lastSentPosition.current);

        if (diff >= TRACK_EVERY_SECONDS && !isSending.current) {
          isSending.current = true;

          progressMutation.mutate(
            { lessonId, lastPosition: currentTime, duration },
            {
              onSettled: () => {
                isSending.current = false;
              },
            },
          );

          lastSentPosition.current = currentTime;
        }
      };

      instance.on("timeupdate", onTimeUpdate);
    };

    const tryInit = async () => {
      if (destroyed) return;
      if (!iframeRef.current) return;

      // iframe phải load xong trước đã
      if (isLoading) {
        retryTimer = setTimeout(tryInit, INIT_RETRY_INTERVAL);
        return;
      }

      try {
        const playerjs = (await import("player.js")).default;
        if (destroyed) return;

        playerInstance = new playerjs.Player(iframeRef.current);
        playerRef.current = playerInstance;

        // Nếu ready không bắn => retry
        let readyTimeout = setTimeout(() => {
          if (destroyed) return;
          cleanup();

          retryCount++;
          if (retryCount <= INIT_MAX_RETRY) {
            retryTimer = setTimeout(tryInit, INIT_RETRY_INTERVAL);
          }
        }, 1200);

        playerInstance.on("ready", () => {
          clearTimeout(readyTimeout);
          if (destroyed) return;

          setIsPlayerReady(true);
          attachTimeUpdate(playerInstance);
        });
      } catch {
        cleanup();
        retryCount++;

        if (retryCount <= INIT_MAX_RETRY) {
          retryTimer = setTimeout(tryInit, INIT_RETRY_INTERVAL);
        }
      }
    };

    tryInit();

    return () => {
      destroyed = true;
      cleanup();
    };
  }, [lessonId, videoKey, isLoading]); // 👈 rất quan trọng

  return (
    <div className="w-full overflow-hidden mt-2">
      <div className="relative w-full aspect-video rounded-xl border bg-card overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground italic">
              Đang tải bài giảng...
            </p>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title={lessonName}
          src={getVideoUrl(videoKey)}
          onLoad={() => setIsLoading(false)}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-none"
        />
      </div>
    </div>
  );
}
