import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAuth } from "@/lib/auth-utils";
import { ReactNode } from "react";
import AppSidebar from "./_components/app-sidebar";
import AppHeader from "./_components/app-header";

const Layout = async ({ children }: { children: ReactNode }) => {
  await requireAuth();
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="w-full">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
