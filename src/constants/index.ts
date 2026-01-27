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
} from "lucide-react";

export const ADMIN_SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
  },

  {
    name: "Users list",
    href: "/admin/users",
    icon: Users,
  },
];
