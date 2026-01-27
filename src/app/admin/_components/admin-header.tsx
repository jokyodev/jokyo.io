import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarTrigger } from "@/components/ui/sidebar";
import UserButton from "./user-button";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Left side: Toggle Sidebar */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-px bg-border mx-2 hidden md:block" />
          <h1 className="text-sm font-medium text-muted-foreground hidden md:block">
            Admin Dashboard
          </h1>
        </div>

        {/* Right side: Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/courses/new"
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "gap-2 h-9",
            )}
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Create Course</span>
            <span className="sm:hidden">Create</span>
          </Link>

          <div className="flex items-center gap-1 ml-2 border-l pl-3">
            <ModeToggle />
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
