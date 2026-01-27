"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { ADMIN_SIDEBAR_LINKS } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton asChild className="gap-x-2 h-10 px-2">
            <Link href="/admin" className="flex items-center gap-2 font-bold">
              <Image src="/logo.png" width={30} height={30} alt="Jokyo.com" />
              <span className="truncate">Jokyo.com</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className="p-2">
          {ADMIN_SIDEBAR_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  isActive={isActive}
                  className={
                    isActive
                      ? "bg-cyan-50 text-cyan-700 hover:bg-cyan-50 hover:text-cyan-700"
                      : ""
                  }
                >
                  <Link href={item.href}>
                    <item.icon className={isActive ? "text-cyan-600" : ""} />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="p-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Đăng xuất"
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/signin");
                    },
                  },
                });
              }}
            >
              <LogOut className="text-red-500" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
