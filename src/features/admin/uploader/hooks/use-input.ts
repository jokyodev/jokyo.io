"use client";

import { getFileDuration } from "@/utils";
import { ChangeEvent, useRef, useState } from "react";

export const useInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [duration, setDuration] = useState<number>(0);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setError("Không có file nào được chọn");
      return;
    }
    const fileSize = selectedFile.size;
    const fileType = selectedFile.type;
    if (fileType.startsWith("video/")) {
      const _duration = await getFileDuration(selectedFile);
      setDuration(_duration);
    }

    if (fileSize > maxSize) {
      setError(
        `Kích thước file quá lớn ( tối đa ${maxSize / 1024 / 1024} MB )`,
      );
      return;
    }

    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(() => URL.createObjectURL(selectedFile));
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl("");
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  return {
    handleFileChange,
    reset,
    file,
    error,
    previewUrl,
    inputRef,
    duration,
  };
};
