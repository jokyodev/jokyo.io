import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { requireAdmin } from "@/lib/auth-utils";
import { ReactNode } from "react";
import AdminSidebar from "./_components/admin-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import AdminHeader from "./_components/admin-header";

const Layout = async ({ children }: { children: ReactNode }) => {
  await requireAdmin();
  return (
    <div>
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
        <div className="p-1 w-full">
          <AdminHeader />
          <div className="p-1"> {children}</div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
