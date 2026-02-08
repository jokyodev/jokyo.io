import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" width={36} height={36} alt="Jokyo Academy" />
            <div className="hidden lg:flex flex-col leading-tight">
              <span className="font-bold text-sm">Jokyo Academy</span>
              <small className="text-muted-foreground font-medium">
                Học lập trình trực tuyến
              </small>
            </div>
          </Link>

          {/* Divider */}
          <div className="hidden lg:block h-6 w-px bg-border" />

          {/* Course Title */}
          <div className="min-w-0">
            <p className="text-sm lg:text-base font-semibold uppercase truncate max-w-[180px] sm:max-w-[260px] lg:max-w-[420px]">
              Xây dựng ứng dụng figma clone with nextjs
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className: "h-9",
            })}
          >
            Dashboard
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
