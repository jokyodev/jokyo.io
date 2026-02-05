"use client";

import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Trophy,
  MessageSquare,
  History,
  Heart,
  HelpCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const studentMenuItems = [
  {
    label: "Cá nhân",
    items: [
      { title: "Khóa học hiện có", icon: LayoutDashboard, href: "/dashboard" },
      {
        title: "Khóa học đã mua",
        icon: GraduationCap,
        href: "/dashboard/my-courses",
      },
      { title: "Lịch sử học tập", icon: History, href: "/history" },
    ],
  },
  {
    label: "Học tập",
    items: [
      { title: "Thư viện khóa học", icon: BookOpen, href: "/courses" },
      { title: "Thành tích (Rank)", icon: Trophy, href: "/leaderboard" },
      { title: "Danh sách yêu thích", icon: Heart, href: "/wishlist" },
    ],
  },
  {
    label: "Cộng đồng",
    items: [
      { title: "Thảo luận", icon: MessageSquare, href: "/discussions" },
      { title: "Hỗ trợ học viên", icon: HelpCircle, href: "/support" },
    ],
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-card/50 backdrop-blur-xl"
    >
      <SidebarHeader className="py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="flex items-center gap-3">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                  <Image
                    src="/logo.png"
                    width={22}
                    height={22}
                    alt="Logo"
                    className="brightness-0 invert"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-tighter">
                    Jokyo Academy
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Student Portal
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {studentMenuItems.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2">
              {group.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "group relative flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon
                          className={cn(
                            "size-5 transition-all duration-300",
                            isActive
                              ? "scale-110 stroke-[2.5px]"
                              : "group-hover:scale-110",
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium tracking-tight",
                            isActive && "font-bold",
                          )}
                        >
                          {item.title}
                        </span>

                        {/* Chỉ báo Active Senior */}
                        {isActive && (
                          <div className="absolute left-0 h-5 w-1 rounded-r-full bg-primary" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="rounded-2xl bg-linear-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 p-4 border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              80%
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold">Tiến độ tuần</span>
              <span className="text-[10px] text-muted-foreground">
                4/5 bài học
              </span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[80%] rounded-full" />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
