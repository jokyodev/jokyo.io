import { buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="py-5 px-5 flex items-center justify-between border-b">
      <div className="flex items-center gap-5">
        <Link href="/" className="flex items-center gap-2 ">
          <Image src="/logo.png" width={40} height={40} alt="Jokyo Academy" />
          <div className="flex flex-col -gap-10">
            <span className="font-bold">Jokyo Academy</span>
            <small className="text-muted-foreground font-medium">
              Học lập trình trực tuyến
            </small>
          </div>
        </Link>
        |
        <div>
          <p className="text-md font-medium uppercase">
            Xây dựng ứng dụng figma clone with nexjts
          </p>{" "}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Link
          href="/dashboard"
          className={buttonVariants({
            className: "",
          })}
        >
          Dashboard
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
