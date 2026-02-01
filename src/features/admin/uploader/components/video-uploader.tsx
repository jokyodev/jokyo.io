import { Button } from "@/components/ui/button";
import { Eye, Loader2, Trash, UploadCloud, Video } from "lucide-react";
import { useInput } from "../hooks/use-input";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { useTransition } from "react";
import { getVideoUrl } from "@/utils";

interface iAppProps {
  value?: string;
  onComplete: (data: { videoKey: string; duration: string }) => void;
}
const VideoUploader = ({ value, onComplete }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const {
    handleFileChange,
    reset,
    file,
    error,
    previewUrl,
    inputRef,
    duration,
  } = useInput(5 * 1024 * 1024 * 1024);

  const trpc = useTRPC();

  const createVideo = useMutation(
    trpc.videoRouter.create.mutationOptions({
      onSuccess: () => {
        console.log("Success..");
        startUploadVideo();
      },
    }),
  );

  const createDeleteVideoUrl = useMutation(
    trpc.videoRouter.createDeleteVideoUrl.mutationOptions({
      onSuccess: () => {
        toast.success("Xóa video thành công");
      },
      onError: (error) => {
        toast.error("Xóa video thất bại , vui lòng kiểm tra lại");
      },
    }),
  );

  const startUploadVideo = () => {
    console.log("Start upload");
  };
  const handleReset = async () => {
    reset();
    onComplete({
      videoKey: "",
      duration: "0",
    });
    if (value) {
      const { accessKey, deleteVideoUrl } =
        await createDeleteVideoUrl.mutateAsync({
          guid: value || "",
        });
      const response = await axios.delete(deleteVideoUrl, {
        headers: {
          AccessKey: accessKey,
        },
      });
      console.log("DELETE", response);
    }
  };

  const handleUploadVideo = async () => {
    startTransition(async () => {
      try {
        const { guid, accessKey } = await createVideo.mutateAsync();
        onComplete({
          videoKey: guid,
          duration: duration.toString(),
        });

        const uploadUrl = `${process.env.NEXT_PUBLIC_BUNNY_STREAM_BASE_URL}/library/${process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID}/videos/${guid}`;
        const response = await axios.put(uploadUrl, file, {
          headers: {
            AccessKey: accessKey,
            "Content-Type": "application/octet-stream",
          },
        });

        const data = response.data;
        if (data.success) {
          toast.success("Upload video thành công");
        } else {
          toast.error("Upload video thất bại");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          "Có lỗi xảy ra trong khi upload video , vui lòng thử lại sau",
        );
      }
    });
  };

  return (
    <div className="w-full h-165 bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden ">
      {!file && !value ? (
        <>
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0  rounded-full  transition-opacity" />
              <div className="relative w-20 h-20 bg-zinc-800 border border-zinc-700 rounded-2xl flex items-center justify-center ">
                <Video className="w-10 h-10 text-zinc-400 " />
              </div>
            </div>

            <div className="text-center space-y-2 px-6">
              <h3 className="text-zinc-200 font-semibold text-lg">
                Tải lên bài giảng Video
              </h3>
              <p className="text-zinc-500 text-sm max-w-[320px]">
                Kéo thả file video vào đây hoặc nhấp để chọn từ thiết bị của bạn
              </p>
            </div>

            <Input
              accept="video/mp4,video/x-m4v,video/*"
              type="file"
              ref={inputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <Button
              type="button"
              className="mt-5"
              onClick={() => {
                inputRef?.current?.click();
              }}
            >
              Chọn video
            </Button>
          </div>
        </>
      ) : !file && value ? (
        <>
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
            <iframe
              src={getVideoUrl(value)}
              loading="lazy"
              allow="accelerometer;gyroscope;encrypted-media;picture-in-picture;"
              className="w-full h-full border-none"
              allowFullScreen
            />
          </div>

          <div className="absolute top-5 left-5 z-100">
            <div className="w-15 py-2.5 bg-zinc-800 rounded-lg border flex flex-col items-center justify-center gap-3">
              <Button
                disabled={createVideo.isPending || value?.length != 0}
                type="button"
                variant="outline"
                onClick={handleUploadVideo}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                  </>
                ) : (
                  <>
                    <UploadCloud />
                  </>
                )}
              </Button>

              <Button
                disabled={isPending}
                type="button"
                variant="destructive"
                onClick={handleReset}
              >
                <Trash />
              </Button>
              <Button type="button" variant="outline">
                <Eye />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <video
            src={previewUrl}
            controls
            className="w-full h-full object-contain"
          ></video>

          <div className="absolute top-5 left-5 z-100">
            <div className="w-15 py-2.5 bg-zinc-800 rounded-lg border flex flex-col items-center justify-center gap-3">
              <Button
                disabled={createVideo.isPending || value?.length != 0}
                type="button"
                variant="outline"
                onClick={handleUploadVideo}
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" />
                  </>
                ) : (
                  <>
                    <UploadCloud />
                  </>
                )}
              </Button>

              <Button
                disabled={isPending}
                type="button"
                variant="destructive"
                onClick={handleReset}
              >
                <Trash />
              </Button>
              <Button type="button" variant="outline">
                <Eye />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoUploader;
