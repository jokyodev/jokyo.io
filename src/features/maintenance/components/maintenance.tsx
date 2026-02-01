"use client";

import LoadingSpinner from "@/components/loading-spinner";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Wrench, ShieldAlert, WandSparkles } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

/**
 * UI concept: Split Layout – Status Board
 * Ý tưởng: giống status page của SaaS lớn (Vercel / Linear)
 * - Bên trái: message + action
 * - Bên phải: trạng thái động (pulse / timeline)
 */

const MaintenanceProvider = ({ children }: { children: ReactNode }) => {
  const trpc = useTRPC();

  const {
    data: siteConfig,
    isLoading,
    refetch,
  } = useQuery(trpc.settingRouter.getSiteConfig.queryOptions());

  useEffect(() => {
    if (siteConfig?.maintenanceMode) {
      const interval = setInterval(() => refetch(), 30000);
      return () => clearInterval(interval);
    }
  }, [siteConfig?.maintenanceMode, refetch]);

  if (isLoading) return <LoadingSpinner />;

  if (siteConfig?.maintenanceMode) {
    return (
      <div className="w-full min-h-svh flex items-center justify-center">
        <div className="flex flex-col gap-2 items-center">
          <WandSparkles />
          <span className="text-muted-foreground text-sm">
            Chúng tôi đang bảo trì hệ thống , vui lòng quay lại sau ít phút
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MaintenanceProvider;
