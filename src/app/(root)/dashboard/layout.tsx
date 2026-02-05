import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";
import { ReactNode } from "react";
import AppSidebar from "./_components/app-sidebar";
import AppHeader from "./_components/app-header";
import MaintenanceProvider from "@/features/maintenance/components/maintenance";

const Layout = async ({ children }: { children: ReactNode }) => {
  await requireAuth();
  return (
    <MaintenanceProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <AppHeader />
          <div className="p-6">{children}</div>
        </main>
      </SidebarProvider>
    </MaintenanceProvider>
  );
};

export default Layout;
