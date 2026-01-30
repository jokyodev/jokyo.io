import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center p-4 ">
      <Loader2
        size={size}
        className={cn(
          "animate-spin text-muted-foreground", // Màu xám nhẹ, xoay tròn
          className,
        )}
      />
      <span className="ml-2 text-sm text-muted-foreground font-medium">
        Đang tải...
      </span>
    </div>
  );
};

export default LoadingSpinner;
