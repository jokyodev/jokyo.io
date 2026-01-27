"use client";
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Upload,
  Trash,
  Eye,
} from "lucide-react";
import { useInput } from "../hooks/use-input";
import { Button } from "@/components/ui/button";
import ImagePreviewer from "./image-previewer";

const ImageUploader = () => {
  const { file, previewUrl, handleFileChange, error, reset, inputRef } =
    useInput(5 * 1024 * 1024);

  return (
    <div className="w-full max-w-87.5">
      <div
        className="group relative h-48 w-full flex flex-col items-center justify-center 
                   border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 dark:bg-zinc-800
                   hover:bg-slate-50 hover:border-cyan-500 transition-all cursor-pointer"
      >
        {previewUrl ? (
          // UI khi đã có ảnh (Preview Mode)
          <div className="relative w-full h-full p-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-60 py-2  flex items-ceter justify-center rounded-sm gap-x-1">
              <Button
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
        )}
      </div>

      {/* Footer message (Optional) */}
      <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
        <ImageIcon className="size-3" />
        <span>Recommended size: 1280x720 (16:9)</span>
      </div>
      {error && <small className="text-red-400">{error}</small>}
    </div>
  );
};

export default ImageUploader;
