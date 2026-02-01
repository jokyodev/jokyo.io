import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  CreditCard,
  MessageSquare,
  Settings,
  ShieldCheck,
  BarChart3,
  FileVideo,
  Settings2Icon,
} from "lucide-react";

export const ADMIN_SIDEBAR_LINKS = [
  {
    name: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Khóa học",
    href: "/admin/courses",
    icon: BookOpen,
  },

  {
    name: "Học viên",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];

export const DASHBOARD_LINKS = [
  {
    name: "dashboard",
  },
];
