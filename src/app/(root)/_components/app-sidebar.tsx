import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Link href="/" className="flex items-center font-bold gap-1">
              <Image src="/logo.png" width={20} height={20} alt="Jokyo.com" />
              Jokyo.com
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
