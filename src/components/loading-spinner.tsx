import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

const LoadingSpinner = ({ className, size = 24 }: LoadingSpinnerProps) => {
  return (
    <div className="flex h-full min-h-svh items-center justify-center p-4 ">
      <Loader2
        size={size}
        className={cn(
          "animate-spin text-muted-foreground", // Màu xám nhẹ, xoay tròn
          className,
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
