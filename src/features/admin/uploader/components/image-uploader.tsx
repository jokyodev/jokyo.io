"use client";
import { UploadCloud, Image as ImageIcon, Upload, Trash } from "lucide-react";
import { useInput } from "../hooks/use-input";
import { Button } from "@/components/ui/button";
import ImagePreviewer from "./image-previewer";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface iAppProps {
  value: string;
  onChange: (value: string) => void;
}

const ImageUploader = ({ value, onChange }: iAppProps) => {
  const trpc = useTRPC();

  const { file, previewUrl, handleFileChange, error, reset, inputRef } =
    useInput(5 * 1024 * 1024);

  const getUploadUrl = useMutation(trpc.image.getUploadUrl.mutationOptions());
  const getDeleteUrl = useMutation(trpc.image.getDeleteUrl.mutationOptions());

  const upload = async () => {
    if (!file) return;
    const {
      accessKey,
      uploadUrl,
      fileId: thumbnnailId,
    } = await getUploadUrl.mutateAsync({
      fileExtension: file.name.split(".")[1],
    });
    if (!accessKey || !uploadUrl) {
      toast.error("Có lỗi xảy ra , vui lòng thử lại sau");
      return;
    }
    const response = await axios.put(uploadUrl, file, {
      headers: {
        AccessKey: accessKey,
        "Content-Type": "application/octet-stream",
      },
    });

    if (response.status === 201) {
      toast.success("Tải lên thumbnail thành công");

      onChange?.(thumbnnailId);
      return;
    } else if (response.status === 400) {
      toast.error("Upload thất bại");
    }
  };

  const deleteImage = async (value: string) => {
    onChange?.("");
    // const response = await axios.delete()
    const { accessKey, deleteUrl } = await getDeleteUrl.mutateAsync({
      fileName: value,
    });
    try {
      const response = await axios.delete(deleteUrl, {
        data: {
          fileName: value,
        },
        headers: {
          AccessKey: accessKey,
        },
      });

      const statusCode = response.status;
      console.log(statusCode);
      if (statusCode === 200) {
        toast.success("Xóa ảnh thành công");
        onChange?.("");
      } else if (statusCode == 400) {
        toast.error("Xóa ảnh thất bại , vui lòng thử lại sau");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra , vui lòng thử lại sau");
    }
  };

  return (
    <div className="w-full max-w-87.5">
      <div
        className="group relative h-48 w-full flex flex-col items-center justify-center 
                   border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 dark:bg-zinc-800
                   hover:bg-slate-50 hover:border-cyan-500 transition-all cursor-pointer"
      >
        {value && (
          <div className="relative w-full h-full p-2">
            <img
              src={`${process.env.NEXT_PUBLIC_BUNNY_IMAGES_CDN}/${value}`}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-60 py-2  flex items-ceter justify-center rounded-sm gap-x-1">
              <Button
                onClick={() => deleteImage(value)}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash />
              </Button>

              <ImagePreviewer
                url={`${process.env.NEXT_PUBLIC_BUNNY_IMAGES_CDN}/${value}`}
              />
            </div>
          </div>
        )}

        {previewUrl && !value ? (
          // UI khi đã có ảnh (Preview Mode)
          <div className="relative w-full h-full p-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-60 py-2  flex items-ceter justify-center rounded-sm gap-x-1">
              <Button
                onClick={upload}
                type="button"
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                <Upload />
              </Button>

              <Button
                onClick={reset}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash />
              </Button>

              <ImagePreviewer url={previewUrl} />
            </div>
          </div>
        ) : (
          !value && (
            // UI khi chưa có ảnh (Empty Mode)
            <div className="flex flex-col items-center justify-center space-y-3 p-6 text-center">
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200">
                <UploadCloud className="size-5 text-cyan-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-muted-foreground">
                  Click to upload thumbnail
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG or WebP (Max. 5MB)
                </p>
              </div>
              <input
                onChange={handleFileChange}
                type="file"
                className="hidden"
                accept="image/*"
                ref={inputRef}
              />
              <Button type="button" onClick={() => inputRef.current?.click()}>
                Chọn file
              </Button>
            </div>
          )
        )}
      </div>

      {/* Footer message (Optional) */}

      {error && <small className="text-red-400">{error}</small>}
    </div>
  );
};

export default ImageUploader;
