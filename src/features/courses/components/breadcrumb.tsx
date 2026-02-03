import Link from "next/link";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface CourseBreadcrumbProps {
  items: BreadcrumbStep[];
  className?: string;
}

export function CourseBreadcrumb({ items, className }: CourseBreadcrumbProps) {
  return (
    <Breadcrumb className={cn("py-4", className)}>
      <BreadcrumbList className="sm:gap-2">
        {/* Luôn có icon Home ở đầu cho "vibe" chuyên nghiệp */}
        <BreadcrumbItem>
          <BreadcrumbLink
            asChild
            className="flex items-center hover:text-primary transition-colors"
          >
            <Link href="/">
              <Home className="h-4 w-4" />
              <span className="sr-only">Trang chủ</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div key={item.label} className="flex items-center gap-2">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-bold text-foreground max-w-[150px] truncate sm:max-w-none">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="hover:text-primary transition-colors"
                  >
                    <Link href={item.href || "#"}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
