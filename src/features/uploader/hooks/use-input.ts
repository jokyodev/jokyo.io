"use client";

import { ChangeEvent, useRef, useState } from "react";

export const useInput = (maxSize: number) => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      setError("Không có file nào được chọn");
      return;
    }
    const fileSize = selectedFile.size;
    if (fileSize > maxSize) {
      setError(
        `Kích thước file quá lớn ( tối đa ${maxSize / 1024 / 1024} MB )`,
      );
      return;
    }
    console.log(selectedFile);
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
  };
};
