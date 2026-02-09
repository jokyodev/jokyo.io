export const getImageUrl = (imageId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BUNNY_IMAGES_CDN}/${imageId}`;
  return url;
};

export const getVideoUrl = (videoId: string) => {
  const url = `https://player.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID}/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`;

  return url;
};

export const getFileDuration = (file: File): Promise<number> => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };
  });
};

export const formatDuration = (seconds: number) => {
  // 1. Trường hợp không có dữ liệu hoặc bằng 0
  if (!seconds || seconds <= 0) return "0 giây";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  // 2. Nếu có giờ: "X giờ Y phút" (Thường bỏ qua giây cho gọn)
  if (h > 0) {
    return `${h} giờ ${m} phút`;
  }

  // 3. Nếu có phút: "X phút Y giây" (Hoặc chỉ "X phút" tùy bạn)
  if (m > 0) {
    return `${m} phút ${s > 0 ? `${s} giây` : ""}`.trim();
  }

  // 4. Nếu ít hơn 1 phút: "X giây"
  return `${s} giây`;
};

export const formatPrice = (price: number | null | undefined) => {
  if (!price || price === 0) return "Free";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(price)
    .replace("₫", ""); // Lấy số, bỏ ₫ để ta tự format UI cho đẹp
};
