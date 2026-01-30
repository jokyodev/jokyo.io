"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, User, Settings, LogOut, Command } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur-xl transition-all">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* LEFT: Sidebar & User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="h-9 w-9 border shadow-sm hover:bg-accent" />
          </div>

          <div className="hidden lg:flex flex-col">
            <h2 className="text-sm font-semibold leading-none">
              Bảng điều khiển
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Chào mừng,{" "}
              <span className="text-primary font-medium">
                jokyodev@gmail.com
              </span>
            </p>
          </div>
        </div>

        {/* CENTER: Search Bar (Smart Responsive) */}
        <div className="flex-1 max-w-md px-4 md:max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Tìm khóa học, bài viết..."
              className="w-full pl-10 pr-12 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:ring-1 transition-all rounded-full"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 border rounded bg-background text-[10px] font-medium text-muted-foreground select-none pointer-events-none">
              <Command className="h-2 w-2" /> K
            </div>
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 rounded-full hover:bg-accent"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full select-none"
              >
                <Avatar className="h-9 w-9 border border-border shadow-sm">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Jokyodev</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    jokyodev@gmail.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-destructive focus:text-destructive-foreground">
                <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
