"use client";
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  ReactNode,
} from "react";

interface VideoPlayerContextType {
  playerRef: React.RefObject<any>;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  // 1. Thêm định nghĩa method seek
  seek: (time: number) => void;
}

const VideoPlayerContext = createContext<VideoPlayerContextType | undefined>(
  undefined,
);

export const VideoPlayerProvider = ({ children }: { children: ReactNode }) => {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const play = () => playerRef.current?.play();
  const pause = () => playerRef.current?.pause();

  // 2. Viết hàm seek thực thi qua playerRef
  const seek = (time: number) => {
    if (playerRef.current) {
      // player.js dùng phương thức setCurrentTime để nhảy đến giây mong muốn
      playerRef.current.setCurrentTime(time);
      // Cập nhật luôn state local để UI phản hồi ngay lập tức
      setCurrentTime(time);
    }
  };

  return (
    <VideoPlayerContext.Provider
      value={{
        playerRef,
        currentTime,
        setCurrentTime,
        play,
        pause,
        seek, // 3. Truyền vào Provider
      }}
    >
      {children}
    </VideoPlayerContext.Provider>
  );
};

export const useVideoPlayer = () => {
  const context = useContext(VideoPlayerContext);
  if (!context) throw new Error("useVideoPlayer error");
  return context;
};
