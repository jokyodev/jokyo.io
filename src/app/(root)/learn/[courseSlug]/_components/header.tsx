import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <div className="col-span-full border-b border flex items-center justify-between px-5 md:px-15">
      <Link
        href="/"
        className="text-black dark:text-white font-bold flex items-center gap-1"
      >
        <Image src="/logo.png" width={30} height={30} alt="Jokyo Academy" />
        Jokyo Academy
      </Link>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;
